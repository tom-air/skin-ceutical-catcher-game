import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
import SelfieButton from '../../assets/selfieBtn.svg';
import SelfieTarget from '../../assets/selfieTarget.svg';
// import Models from '../../assets/models';
import './selfie.css';

const SelfiePage = () => {
  let video;
  let currentFacingMode = 'user';
  let faceDetection;
  const [isAllow, setAllow] = useState(false);
  const history = useHistory();

  const setUpFaceApi = async () => {
    await faceapi.loadTinyFaceDetectorModel('/models')
    await faceapi.loadFaceLandmarkModel('/models')
    // await faceapi.loadFaceRecognitionModel('/models')
    // await faceapi.loadFaceExpressionModel('/models')
    initCameraUI();
    initCameraStream();
  }

  useEffect(() => {
    // if (!window.startApp) {
    //   history.push('/');
    // } else {
    //   setUpFaceApi();
    // }
    setUpFaceApi();
    return unmountComponent;
  }, []);

  const unmountComponent = () => {
    if (video) {
      console.log('unmount page!!', video)
      video.removeEventListener('play', faceTracking);
      clearInterval(faceDetection);
    }
  }

  const handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
  
    const track = window.stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const str = JSON.stringify(settings, null, 4);
    console.log('settings ' + str);
  }
  
  const initCameraStream = () => {
    const constraints = {
      audio: false,
      video: {
        width: { min: window.innerWidth, ideal: 1280 },
        height: { min: window.innerHeight, ideal: 1080 },
        aspectRatio: 2.16533,
        facingMode: currentFacingMode,
      }
    };
  
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch((error) => {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      });
  }

  const faceTracking = () => {
    console.log('start tracking', video)
    const mainCanvas = document.getElementById('main-canvas');
    const canvas = faceapi.createCanvasFromMedia(video);
    const selfieCanvas = document.getElementById('circle-frame');
    const selfieTarget = document.getElementById('selfie-target');
    mainCanvas.append(canvas);
    const displaySize = { width: selfieCanvas.offsetWidth, height: selfieCanvas.offsetHeight }
    faceapi.matchDimensions(canvas, displaySize)
    faceDetection = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      if (resizedDetections.length) {
        const { detection } = resizedDetections[0];
        if (detection._score > 0.9) {
          setAllow(true);
          selfieTarget.style.opacity = 0.9;
        } else {
          selfieTarget.style.opacity = 0.45;
          setAllow(false);
        }
      } else {
        selfieTarget.style.opacity = 0;
        setAllow(false);
      }
    }, 1000)
  }
  
  const initCameraUI = () => {
    video = document.getElementById('video');
    video.addEventListener('play', faceTracking);
  }

  const onCapture = () => {
    if (isAllow) {
      const canvas = document.createElement('canvas');
      const selfieCanvas = document.getElementById('circle-frame');
      const input = document.getElementById('video');
      canvas.width = selfieCanvas.offsetWidth;
      canvas.height = selfieCanvas.offsetHeight;
      canvas.getContext('2d').drawImage(input, 0, 0, canvas.width, canvas.height);
      const dataURI = canvas.toDataURL('image/png');
      window.selfieURI = dataURI;
      history.push('/preview');
    }
  }

  const submitBtnStyle = { filter: isAllow ? 'unset' : 'grayscale(100%)' };
  
  return (
    <section id="screen-selfie">
      <div className="topbar">
        <img className="brand-logo" src={BrandLogo} />
        <p>抗老力测测看</p>
      </div>
      <video playsInline autoPlay id="video"></video>
      <div id="main-canvas">
        <div id="circle-frame"></div>
        <img id="selfie-target" src={SelfieTarget} />
        <p>对准脸庞拍照</p>
        {/* <div id="selfie-canvas"></div> */}
      </div>
      <div className="lowbar">
        <button id="selfie-button" style={submitBtnStyle} onClick={onCapture}>
          <img src={SelfieButton} />
        </button>
      </div>
    </section>
  );
}

export default SelfiePage;
