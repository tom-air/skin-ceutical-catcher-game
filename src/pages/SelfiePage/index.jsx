import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert'
import * as faceapi from 'face-api.js';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
// import SelfieButton from '../../assets/selfieBtn.svg';
import SelfieTarget from '../../assets/selfieTarget.svg';
import TopBarBg from '../../assets/Selfie_topbar.png';
import LowBarBg from '../../assets/Selfie_low\ bar.png';
import './selfie.css';

const SelfiePage = () => {
  let video;
  let currentFacingMode = 'user';
  let faceDetection;
  const [isAllow, setAllow] = useState(false);
  const [showAlert, setAlert] = useState('');
  const history = useHistory();
  const alert = useAlert();

  const setUpFaceApi = async () => {
    await faceapi.loadTinyFaceDetectorModel('/models')
    initCameraUI();
    initCameraStream();
  }

  useEffect(() => {
    if (showAlert) {
      alert.info(showAlert)
    }
  }, [showAlert])

  useEffect(() => {
    if (!window.startApp) {
      history.push('/');
    } else {
      setUpFaceApi();
      const root = document.getElementById('root');
      root.style.backgroundImage = 'none';
      root.style.background = '#220B02';
      // setUpFaceApi();
      return unmountComponent;
    }
  }, []);

  const unmountComponent = () => {
    if (video) {
      video.removeEventListener('play', faceTracking);
      clearInterval(faceDetection);
    }
  }

  const handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
  
    // const track = window.stream.getVideoTracks()[0];
    // const settings = track.getSettings();
    // const str = JSON.stringify(settings, null, 4);
  }
  
  const initCameraStream = () => {
    const screen = document.getElementById('main-canvas');
    const constraints = {
      audio: false,
      video: {
        // height: { exact: screen.clientWidth },
        height: { exact: screen.clientHeight },
        height: { exact: window.screen.width },
        // aspectRatio: 752/375,
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
    const screen = document.getElementById('screen-selfie');
    const canvas = faceapi.createCanvasFromMedia(video);
    const selfieTarget = document.getElementById('selfie-target');
    screen.append(canvas);
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
    faceapi.matchDimensions(canvas, displaySize)
    faceDetection = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      if (resizedDetections.length) {
      const { _score } = resizedDetections[0];
        if (_score >= 0.6) {
          setAllow(true);
          selfieTarget.style.opacity = 0.9;
        } else {
          selfieTarget.style.opacity = 0.45;
          setAllow(false);
        }
      } else {
        selfieTarget.style.opacity = 0.1;
        setAllow(false);
        setAlert('配戴口罩可能影響人面辨識功能。')
      }
    }, 500)
  }
  
  const initCameraUI = () => {
    video = document.getElementById('video');
    video.addEventListener('play', faceTracking);
  }

  const onCapture = async () => {
    if (isAllow) {
      const input = document.getElementById('video');
      const canvas = document.createElement('canvas');
      const selfieCanvas = document.getElementById('circle-frame');
      const { x, y, width, height } = selfieCanvas.getBoundingClientRect();
      // const x = selfieCanvas.offsetLeft;
      // const y = selfieCanvas.offsetTop;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1,1);
      ctx.drawImage(input, x, y, width, height, 0, 0, width, height);
      const dataURI = canvas.toDataURL('image/png');
      window.selfieURI = dataURI;
      history.push('/preview');
    }
  }

  const submitBtnStyle = { filter: isAllow ? 'unset' : 'grayscale(100%)' };
  
  return (
    <>
      <video playsInline autoPlay id="video"></video>
      <section id="screen-selfie">
        <div className="topbar">
          <img className="brand-logo" src={BrandLogo} />
          <p>抗老力测测看</p>
          <img id="top-bar-bg" src={TopBarBg} />
        </div>
        {/* <video playsInline autoPlay id="video"></video> */}
        <div id="main-canvas">
          <div id="circle-frame"></div>
          <img id="selfie-target" src={SelfieTarget} />
          <p>对准脸庞拍照</p>
        </div>
        <div className="lowbar">
          <button id="selfie-button" style={submitBtnStyle} onClick={onCapture}>
            {/* <img src={SelfieButton} /> */}
          </button>
          <img id="low-bar-bg" src={LowBarBg} />
        </div>
      </section>
    </>
  );
}

export default SelfiePage;
