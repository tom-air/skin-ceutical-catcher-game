import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { useHistory } from 'react-router-dom';
import { trackEvent, config } from '../../UtilHelpers';
import './selfie.css';
import Video from './Video';

const BrandLogo = `${config.assetsUrl}/Logo_white.png`;
const SelfieTarget = `${config.assetsUrl}/selfie_target.svg`;
const TopBarBg = `${config.assetsUrl}/selfie_topbar.png`;
const LowBarBg = `${config.assetsUrl}/selfie_low_bar.png`;
const SelfieTopbarGoldLine = `${config.assetsUrl}/selfie_topbar_gold_line.png`;

const SelfiePage = () => {
  let video;
  let currentFacingMode = 'user';
  let faceDetection;
  const videoRef = useRef(null);
  const [isAllow, setAllow] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showAlert, setAlert] = useState('');
  const history = useHistory();

  const setUpFaceApi = async () => {
    await faceapi.loadTinyFaceDetectorModel('https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public')
    // setLoading(false);
    initCameraUI();
    initCameraStream();
  }

  useEffect(() => {
    if (showAlert) {
      const alertBox = document.getElementById('alert-box');
      alertBox.style.animationDuration = '8s';
    }
  }, [showAlert])

  useEffect(() => {
    if (!window.startApp) {
      history.push('/');
    } else {
      setUpFaceApi();
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
  }
  
  const initCameraStream = () => {
    const constraints = {
      audio: false,
      video: {
        width: { exact: window.innerHeight },
        height: { exact: window.innerWidth },
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

  const faceTracking = async () => {
    const screen = document.getElementById('screen-selfie');
    const canvas = faceapi.createCanvasFromMedia(video);
    const selfieTarget = document.getElementById('selfie-target');
    screen.append(canvas);
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
    faceapi.matchDimensions(canvas, displaySize)
    // await faceapi.loadTinyFaceDetectorModel('/models');
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
        setAlert('面向镜头\n确保脸庞清晰可见');
      }
    }, 500)
  }
  
  const initCameraUI = () => {
    video = document.getElementById('video');
    if (video) {
      video.addEventListener('play', faceTracking);
    }
  }

  const applyBrightness = (data, brightness) => {
    for (var i = 0; i < data.length; i+= 4) {
      data[i] += 255 * (brightness / 100);
      data[i+1] += 255 * (brightness / 100);
      data[i+2] += 255 * (brightness / 100);
    }
  }

  const truncateColor = (value) => {
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
    return value;
  }

  const applyContrast = (data, contrast) => {
    const factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    for (var i = 0; i < data.length; i+= 4) {
      data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
      data[i+1] = truncateColor(factor * (data[i+1] - 128.0) + 128.0);
      data[i+2] = truncateColor(factor * (data[i+2] - 128.0) + 128.0);
    }
  }

  const onCapture = async () => {
    if (isAllow) {
      const input = document.getElementById('video');
      const canvas = document.createElement('canvas');
      const ehancedCanvas = document.createElement('canvas');
      const selfieCanvas = document.getElementById('circle-frame');
      const { x, y, width, height } = selfieCanvas.getBoundingClientRect();
      // const x = selfieCanvas.offsetLeft;
      // const y = selfieCanvas.offsetTop;
      canvas.width = width;
      canvas.height = height;
      ehancedCanvas.width = width;
      ehancedCanvas.height = height;
      const ctx = canvas.getContext('2d');
      const enhancedCtx = ehancedCanvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1,1);
      ctx.drawImage(input, x, y, width, height, 0, 0, width, height);
      enhancedCtx.translate(canvas.width, 0);
      enhancedCtx.scale(-1,1);
      enhancedCtx.drawImage(input, x, y, width, height, 0, 0, width, height);
      const imageData = enhancedCtx.getImageData(0, 0, canvas.width, canvas.height);
      applyBrightness(imageData.data, 8);
      // applyContrast(imageData.data, 10);
      enhancedCtx.putImageData(imageData, 0, 0);
      const dataURI = canvas.toDataURL('image/png');
      const enhancedDataURI = ehancedCanvas.toDataURL('image/png');
      window.selfieURI = dataURI;
      window.enhancedSelfieURI = enhancedDataURI;
      trackEvent('button', 'click', 'take-selfie');
      history.push('/preview');
    }
  }

  const submitBtnStyle = { opacity: isAllow ? '100%' : '50%' };
  
  // if (isLoading) return <LoadingPage />;
  return (
    <section>
      <video playsInline autoPlay id="video" ref={videoRef}></video>
      {videoRef.current && <Video video={videoRef.current} />}
      <section id="screen-selfie">
        <div className="topbar">
          <img className="brand-logo" src={BrandLogo} />
          <p>测试你的抗氧力</p>
          <img id="top-bar-bg" src={TopBarBg} />
          <img id="selfie-topbar-goldline" src={SelfieTopbarGoldLine} />
        </div>
        <div id="alert-box">
          <p>{showAlert}</p>
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
    </section>
  );
}

export default SelfiePage;
