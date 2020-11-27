import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
import SelfieButton from '../../assets/selfieBtn.svg';
import SelfieTarget from '../../assets/selfieTarget.svg';
import './selfie.css';

const SelfiePage = () => {
  let video;
  let currentFacingMode = 'user';
  let faceDetection;
  const [isAllow, setAllow] = useState(false);
  const [capturedBox, setCapturedBox] = useState(null);
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
    const root = document.getElementById('root');
    root.style.backgroundImage = 'none';
    root.style.background = '#220B02';
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
    const screen = document.getElementById('screen-selfie');
    const canvas = faceapi.createCanvasFromMedia(video);
    const selfieTarget = document.getElementById('selfie-target');
    screen.append(canvas);
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
    faceapi.matchDimensions(canvas, displaySize)
    faceDetection = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      if (resizedDetections.length) {
      // faceapi.draw.drawDetections(canvas, resizedDetections)
      // // draw the landmarks into the canvas
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      
      const { detection } = resizedDetections[0];
      console.log('>>>>boxxx', resizedDetections)
        if (detection._score > 0.9) {
          setAllow(true);
          selfieTarget.style.opacity = 0.9;
          setCapturedBox(detection);
        } else {
          selfieTarget.style.opacity = 0.45;
          setCapturedBox(null);
          setAllow(false);
        }
      } else {
        selfieTarget.style.opacity = 0.1;
        setCapturedBox(null);
        setAllow(false);
      }
    }, 1000)
  }
  
  const initCameraUI = () => {
    video = document.getElementById('video');
    video.addEventListener('play', faceTracking);
  }

  const onCapture = async () => {
    console.log('>> on click Capture', isAllow, capturedBox)
    if (isAllow) {
      console.log('>> on Capture')
      const canvas = document.createElement('canvas');
      const selfieCanvas = document.getElementById('circle-frame');
      const { x, y, width, height } = selfieCanvas.getBoundingClientRect();
      const framStyle = getComputedStyle(selfieCanvas);
      const marginTop = parseInt(framStyle.marginTop);
      const screenME = document.getElementById('screen-selfie');
      const screenStyle = getComputedStyle(screenME);
      const marginLeft = parseInt(screenStyle.marginLeft);
      const screenWidth = parseInt(screenStyle.width);
      const screenHeight = parseInt(screenStyle.height);
      const input = document.getElementById('video');

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      const pox = parseInt(((x - marginLeft) / screenWidth) * input.videoWidth);
      const poy = parseInt(((y + marginTop) / screenHeight) * input.videoHeight);
      const finalWidth = (width / screenWidth) * input.videoWidth;
      const finalHeight = (height / screenHeight) * input.videoHeight;
      console.log('>>>>>+++MEMEME', x, y, pox, poy, screenWidth, screenHeight, input.videoWidth, input.videoHeight);
      ctx.drawImage(input, pox, poy, finalWidth, finalHeight, 0, 0, width, height);
      ctx.translate(canvas.width, 0);
      ctx.scale(-1,1);
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
