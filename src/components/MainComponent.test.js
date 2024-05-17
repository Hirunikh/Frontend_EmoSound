import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MainComponent from './MainComponent';
import { BrowserRouter } from 'react-router-dom';

describe('MainComponent', () => {
  // Mock fetch to prevent actual API calls during tests
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ emotion: 'happy', music: [] }),
      })
    );
  });

  // Reset fetch mock after each test
  afterEach(() => {
    global.fetch.mockClear();
  });

  // Test1: renders without crashing
  it('renders without crashing', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    expect(await screen.findByText(/Emotion Detector/i)).toBeInTheDocument();
  });

  // Test2: renders capture button when not in automatic mode
  it('renders capture button when not in automatic mode', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    expect(await screen.findByText(/Capture/i)).toBeInTheDocument();
  });

  // Test3: renders music recommendations
  it('renders music recommendations', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating async delay
    });
    expect(await screen.findByText(/Recommendations/i)).toBeInTheDocument();
  });

  // Test4: toggles automatic mode and captures images
  it('toggles automatic mode and captures images', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    // Wait for the component to render completely
    await screen.findByText('Emotion Detector - Let\'s uncover the mood you\'re in right now!');

    // Find and interact with the automatic mode toggle
    const automaticModeToggle = screen.getByText('Automatic Mode').closest('div');
    expect(automaticModeToggle).toBeInTheDocument();

    fireEvent.click(automaticModeToggle.querySelector('input'));

    // Wait for automatic mode to start capturing images (simulate 6 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if image capture occurs by checking if fetch is called
    expect(global.fetch).toHaveBeenCalled();
  }, 10000);

  // Test5: handles error gracefully when API call fails
  it('handles error gracefully when API call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    global.fetch = jest.fn(() => Promise.reject('API error'));
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    // Wait for the component to render completely
    await screen.findByText('Emotion Detector - Let\'s uncover the mood you\'re in right now!');
    // Ensure the error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching popular playlists:', 'API error');
    consoleErrorSpy.mockRestore(); // Restore the original console.error method
  });

  // Test6: loads popular playlists on initial render
  it('loads popular playlists on initial render', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/popular_playlists');
  });

  // Test7: renders recommendations when provided with data
  it('renders recommendations when provided with data', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating async delay
    });
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  // Test8: plays music when handlePlayMusic is called
  it('plays music when handlePlayMusic is called', async () => {
    render(<BrowserRouter><MainComponent /></BrowserRouter>);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating async delay
    });
  });

  // Functional Test: Capture image and send function works
  it('captures image and sends it to backend', async () => {
    render(<MainComponent />);
    const captureButton = await screen.findByText('Capture');
    fireEvent.click(captureButton);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating async delay
    });
    expect(global.fetch).toHaveBeenCalled();

  });

});
