import React, { useState } from 'react';
import MainComponent from './components/MainComponent';
import './App.css';

function App() {

  return (
    <div className="App">
      <div class="title">EmoSound: Your Mood, Your Music, Your AI Symphony!</div>
      <div class="slogan">Your emotion sets the stage, and the music follows.</div>
      <MainComponent></MainComponent>
    </div>
  );
}

export default App;
