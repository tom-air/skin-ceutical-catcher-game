import React, { useEffect, useState } from 'react';
import * as pico from 'picojs/pico';
import { useHistory } from 'react-router-dom';
import { trackEvent, config } from '../../UtilHelpers';
import './selfie.css';
import camvas from './camvas';

import BrandLogo from '../../assets/Logo_white.png';
import SelfieTarget from '../../assets/selfie_target.svg';
import TopBarBg from '../../assets/selfie_topbar.png';
import LowBarBg from '../../assets/selfie_low_bar.png';
import SelfieTopbarGoldLine from '../../assets/selfie_topbar_gold_line.png';
// const BrandLogo = `${config.assetsUrl}/Logo_white.png`;
// const SelfieTarget = `${config.assetsUrl}/selfie_target.svg`;
// const TopBarBg = `${config.assetsUrl}/selfie_topbar.png`;
// const LowBarBg = `${config.assetsUrl}/selfie_low_bar.png`;
// const SelfieTopbarGoldLine = `${config.assetsUrl}/selfie_topbar_gold_line.png`;

const SelfiePage = () => {
  let video, mycamvas;
  let currentFacingMode = 'user';
  let faceDetection;
  const [isAllow, setAllow] = useState(false);
  const [showAlert, setAlert] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (showAlert) {
      const alertBox = document.getElementById('alert-box');
      alertBox.style.animationDuration = '8s';
    }
  }, [showAlert])

  useEffect(() => {
    if (!window.startApp) {
      history.push('/aoxmobilegame2020');
    } else {
      initCameraUI();
      initCameraStream();
      return unmountComponent;
    }
  }, []);

  const unmountComponent = () => {
    if (video) {
      video.removeEventListener('play', faceTracking);
      mycamvas.end();
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

  const faceTracking = () => {
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
    const update_memory = pico.instantiate_detection_memory(5); // we will use the detecions of the last 5 frames
    let facefinder_classify_region = function(r, c, s, pixels, ldim) {return -1.0;};
    const cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
    fetch(cascadeurl).then(function(response) {
      response.arrayBuffer().then(function(buffer) {
        const bytes = new Int8Array(buffer);
        facefinder_classify_region = pico.unpack_cascade(bytes);
      })
    })
    const selfieCanvas = document.getElementById('selfie-canvas');
    selfieCanvas.setAttribute('width', video.videoWidth);
    selfieCanvas.setAttribute('height', video.videoHeight);
    const ctx = selfieCanvas.getContext('2d');
    function rgba_to_grayscale(rgba, nrows, ncols) {
      let gray = new Uint8Array(nrows*ncols);
      for(let r=0; r<nrows; ++r)
        for(let c=0; c<ncols; ++c)
          // gray = 0.2*red + 0.7*green + 0.1*blue
          gray[r*ncols + c] = (2*rgba[r*4*ncols+4*c+0]+7*rgba[r*4*ncols+4*c+1]+1*rgba[r*4*ncols+4*c+2])/10;
      return gray;
    }
    const processfn = function(videoSrc, dt) {
      const hRatio = (selfieCanvas.width / video.videoWidth) * video.videoHeight;
      ctx.drawImage(videoSrc, 0, 0, selfieCanvas.width, hRatio);
      const rgba = ctx.getImageData(0, 0, displaySize.width, displaySize.height).data;
      // prepare input to `run_cascade`
      const image = {
        "pixels": rgba_to_grayscale(rgba, displaySize.height, displaySize.width),
        "nrows": displaySize.height,
        "ncols": displaySize.width,
        "ldim": displaySize.width
      }
      const params = {
        "shiftfactor": 0.1, // move the detection window by 10% of its size
        "minsize": 50,     // minimum size of a face
        "maxsize": 1000,    // maximum size of a face
        "scalefactor": 1.1  // for multiscale processing: resize the detection window by 10% when moving to the higher scale
      }
      // run the cascade over the frame and cluster the obtained detections
      // dets is an array that contains (r, c, s, q) quadruplets
      // (representing row, column, scale and detection score)
      let dets = pico.run_cascade(image, facefinder_classify_region, params);
      dets = update_memory(dets);
      dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
      // draw detections
      let detected = false;
      for(let i=0; i<dets.length; ++i) {
        // check the detection score
        // if it's above the threshold, draw it
        // (the constant 50.0 is empirical: other cascades might require a different one)
        if(dets[i][3]>50.0) {
          detected = true;
        }
      }
      if (detected) {
        setAllow(true);
      } else {
        setAllow(false);
        setAlert('面向镜头\n确保脸庞清晰可见');
      }
    }
    mycamvas = new camvas(ctx, processfn);
    mycamvas.update();
  }
  
  const initCameraUI = () => {
    video = document.getElementById('video');
    if (video) {
      video.addEventListener('play', faceTracking);
    }
  }

  const applyBrightness = (data, brightness) => {
    for (let i = 0; i < data.length; i+= 4) {
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
      const scale = 2;
      ehancedCanvas.width = width * scale;
      ehancedCanvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      const enhancedCtx = ehancedCanvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1,1);
      ctx.drawImage(input, x, y, width, height, 0, 0, width, height);
      enhancedCtx.translate(canvas.width * scale, 0);
      enhancedCtx.scale(-1,1);
      enhancedCtx.drawImage(input, x, y, width, height, 0, 0, width * scale, height * scale);
      const imageData = enhancedCtx.getImageData(0, 0, width * scale, height * scale);
      applyBrightness(imageData.data, 8);
      // applyContrast(imageData.data, 10);
      enhancedCtx.putImageData(imageData, 0, 0);
      const dataURI = canvas.toDataURL('image/png');
      const enhancedDataURI = ehancedCanvas.toDataURL('image/png');
      window.selfieURI = dataURI;
      window.enhancedSelfieURI = enhancedDataURI;
      trackEvent('button', 'click', 'take-selfie');
      history.push('/aoxmobilegame2020/preview');
    }
  }

  const selfieTargetStyle = { opacity: isAllow ? '90%' : '10%' };
  const submitBtnStyle = { opacity: isAllow ? '100%' : '50%' };
  
  return (
    <section>
      <video playsInline autoPlay id="video"></video>
      <canvas id="selfie-canvas"></canvas>
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
          <img id="selfie-target" style={selfieTargetStyle} src={SelfieTarget} />
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
