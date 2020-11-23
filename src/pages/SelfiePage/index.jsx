import React, { useEffect } from 'react';
import BrandLogo from '../../assets/Logo_white.png';
import SelfieButton from '../../assets/selfieBtn.svg';
import './selfie.css';

const SelfiePage = () => {
  let video;
  let currentFacingMode = 'user';

  useEffect(() => {
    initCameraUI();
    initCameraStream();
  });

  const handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
  
    const track = window.stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const str = JSON.stringify(settings, null, 4);
    console.log('settings ' + str);
  }
  
  const initCameraStream = () => {
    // stop any active streams in the window
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        console.log(track);
        track.stop();
      });
    }
  
    const constraints = {
      audio: false,
      video: {
        width: { min: window.innerWidth, ideal: 1280 },
        height: { min: window.innerHeight, ideal: 1080 },
        facingMode: currentFacingMode,
      },
    };
  
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch((error) => {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      });
  }
  
  const initCameraUI = () => {
    console.log('init UI')
    video = document.getElementById('video');
  }

  return (
    <section id="screen-selfie">
      <div className="topbar">
        <img className="brand-logo" src={BrandLogo} />
        <p>抗老力测测看</p>
      </div>
      <video playsInline autoPlay id="video"></video>
      {/* <div className="main-canvas">
        <canvas id="selfie-canvas"></canvas>
      </div> */}
      <div className="lowbar">
        <button id="selfie-button">
          <img src={SelfieButton} />
        </button>
      </div>
    </section>
  );
}

export default SelfiePage;
