import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./MainComponent.css"

let spotifyEmbedController = null;
let captureInterval = null;

window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    const options = {
        width: '100%',
        height: '100%',
        // uri: 'spotify:track:6tNQ70jh4OwmPGpYy6R2o9'
    };
    const callback = (EmbedController) => {
        spotifyEmbedController = EmbedController;
    };
    IFrameAPI.createController(element, options, callback);
};

const MainComponent = ({ onEmotionDetection }) => {
    // State and ref initialization
    const webcamRef = useRef(null);
    const [recommendedMusic, setRecommendedMusic] = useState([]);
    const [automaticMode, setAutomaticMode] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [detectedEmotion, setDetectedEmotion] = useState('');

    // Method to capture image from webcam and send to backend
    const captureImageAndSend = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        sendImageToBackend(imageSrc);
    };

    // API call to send image to backend for emotion detection
    const sendImageToBackend = async (imageSrc) => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:5000/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageSrc }),
                mode: 'cors', // Ensure CORS is enabled
            });
            const data = await response.json();
            setDetectedEmotion(data.emotion); // Set the detected emotion
            renderRecommendations(data.music);
            setIsLoading(false)
        } catch (error) {
            console.error('Error during emotion detection:', error);
        }
    };

    // Method to render music recommendations
    const renderRecommendations = (data) => {
        let renderList = data.map(song =>
            <div key={song.uri} className="song-item">
                <div className="song-info">
                    <div className="song-name">{song.name}</div>
                    <div className="artist">{song.artist}</div>
                    <div className="album">{song.album}</div>
                    <div className="duration">{song.duration}</div>
                </div>
                <button className="play-button" onClick={() => handlePlayMusic(song.uri)}><i className="material-icons">play_arrow</i></button>
            </div>
        );
        setRecommendedMusic(renderList);
    };

    // Method to handle playing music
    const handlePlayMusic = (uri) => {
        spotifyEmbedController.loadUri(uri);
        spotifyEmbedController.play();
    };

    // API call to fetch popular playlists
    const fetchPopularPlaylists = async () => {
        try {
            const response = await fetch('http://localhost:5000/popular_playlists');
            const data = await response.json();
            if (data && data.length > 0 && data[0].tracks && data[0].tracks.length > 0) {
                renderRecommendations(data[0].tracks);
                setIsLoading(false);
                spotifyEmbedController.loadUri(data[0].tracks[0].uri);
            } else {
                console.error('Error: No tracks found in popular playlists');
            }
        } catch (error) {
            console.error('Error fetching popular playlists:', error);
        }
    };

    // Spotify iframe API initialization
    useEffect(() => {
        if (initialLoad) {
            fetchPopularPlaylists().then(() => setInitialLoad(false));
        }
    });

    return (
        <div className="container">
            {/* Webcam container */}
            <div className="webcam-container">
                <h5 className="emotion-detector">Emotion Detector - Let's uncover the mood you're in right now!</h5>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    className="webcam-video"
                    screenshotFormat="image/jpeg"
                    width="100%" // Ensure webcam takes full width of its container
                />
                <div className="controls-container">
                    {/* Toggle for automatic mode */}
                    <div className="toggle-container">
                        <span>Automatic Mode</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                value={automaticMode}
                                onChange={event => {
                                    let newVal = !automaticMode;
                                    setAutomaticMode(newVal);
                                    if (newVal) {
                                        captureInterval = setInterval(() => {
                                            captureImageAndSend();
                                        }, 5000); // Capture image every 5 seconds
                                    } else {
                                        clearInterval(captureInterval)
                                    }
                                }}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    {/* Button to manually capture image */}
                    {!automaticMode && <button className="button" onClick={captureImageAndSend}>Capture</button>}
                </div>  
                {/* Display detected emotion */}
                {detectedEmotion && <div className="detected-emotion"> {detectedEmotion}</div>}          
            </div>
            {/* Music container */}
            <div className="music-container">
                <h5 className="feel-the-music">Feel the Music, Let your emotions dance with the melody I suggest.</h5>
                <div className="player">
                    {initialLoad && <Skeleton height={`100%`} width={`100%`} count={1} />}
                    <div id="embed-iframe"></div>
                </div>
                <h2 className="recommendations">Recommendations</h2>
                <div className="songs-container">
                    {isLoading && <Skeleton height={`100%`} width={`100%`} count={1} />}
                    <div className="song-list">
                        {recommendedMusic}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainComponent;


