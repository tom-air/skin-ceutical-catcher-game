import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useHistory } from 'react-router-dom';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import BrandLogo from '../../assets/Logo_white.png';
import CatchCircle from '../../assets/ar_teach_catch_circle.png';
import CatchCTAArrow from '../../assets/selfie_result_cta_arrow.png';
import CatchButton from '../../assets/selfie_result_catch_btn.png';
import ActiveCatchCircle from '../../assets/ar_active_catch_circle.png';
import CatchCircleBg from '../../assets/ar_catch_circle_bg.png';
import SelfieResultWinkles from '../../assets/selfie_result_wrinkle.png';
import normalGirl from '../../assets/girl_normal.png';
import ArBenifitArrow from '../../assets/ar_benifit.png';
import PlayInfoArea from '../../assets/player_info_area.png';
import ArMeasureElement from '../../assets/ar_measure_element.png';
import './game.css';

const ele1 = new THREE.TextureLoader().load('/fluid/1.png');
const ele2 = new THREE.TextureLoader().load('/fluid/2.png');
const ele3 = new THREE.TextureLoader().load('/fluid/3.png');
const ele4 = new THREE.TextureLoader().load('/fluid/4.png');
const ele5 = new THREE.TextureLoader().load('/fluid/5.png');
const ele6 = new THREE.TextureLoader().load('/fluid/6.png');
const ele7 = new THREE.TextureLoader().load('/fluid/7.png');
const eleTexture = [{
  element: ele1,
  title: '中和自由基',
  id: 'gold-element-1',
 }, {
  element: ele2,
  title: '淡斑',
  id: 'gold-element-2',
 }, {
  element: ele3,
  title: '緊緻',
  id: 'gold-element-3',
 }, {
  element: ele4,
  title: '撫紋',
  id: 'gold-element-4',
 }, {
  element: ele5,
  title: '中和自由基',
  id: 'gold-element-5',
 }, {
  element: ele6,
  title: '淡斑',
  id: 'gold-element-6',
 }, {
  element: ele7,
  title: '撫紋',
  id: 'gold-element-7',
 }];

const GamePage = () => {
  let camera, scene, renderer, controls, videoTexture, video, time, clmesh;
  let activeCatchCircle, catchCircle, catchBtn;
  let animateFrame;

  const history = useHistory();

  const [isGameStarted, setStartGame] = useState(false);
  const [counter, setCounter] = useState(60);
  let eleToCatchId = '';
  let eleCaught = 0;

  const screenRef = useRef(null);

  const timeUpAnimation = () => {
    window.cancelAnimationFrame(animateFrame);
    catchBtn.removeEventListener('click', () => {})
    
  }

  const removeEl = (id) => {
    let el = scene.getObjectByName(id)
    scene.remove(el);
    eleToCatchId = ''
  }

  const catchElement = (eleId) => {
    if (eleId) {
      eleCaught = eleCaught + 1;
      removeEl(eleId);
      updateProgess(eleCaught);
      renderBenefitArrow(eleId);
      setStartGame(1);
      if (eleCaught >= 7) {
        setTimeout(() => {
          window.cancelAnimationFrame(animateFrame);
          catchBtn.removeEventListener('click', () => {})
          history.push('./share')
        }, 2000);
        // history.push('./share')
      }
    }
  }

  const trackCamera = () => {
    const threshold = 0.2;
    const minThreshold = 0.4;
    const sceneEls = scene.children;
    let isCloseToCenter = false;
    let isNearToTarget = false;
    let eleId = '';
    for (let i = 0; i < sceneEls.length; i ++) {
      const element = sceneEls[i];
      // console.log('MEMEMEMEME', element.uuid)
      element.lookAt(camera.position);
      element.quaternion.copy(camera.quaternion);
      const positionScreenSpace = element.position.clone().project(camera);
      positionScreenSpace.setZ(0);
      const positionLenToCenter = positionScreenSpace.length();
      if (positionLenToCenter < threshold) {
        isCloseToCenter = true;
        eleId = element.name;
        // eleId = element.uuid;
      } else if (positionLenToCenter < minThreshold) {
        isNearToTarget = true;
        eleId = element.name;
        // eleId = element.uuid;
      }
      
      // scene.children[i].quaternion.copy(camera.quaternion);
    }
    
    eleToCatchId = eleId;
    if (isNearToTarget) {
      catchCircle.style.display = 'none';
      activeCatchCircle.style.display = 'block';
      activeCatchCircle.style.animationDuration = '24s';
      activeCatchCircle.style["-webkit-animation-duration"] = '24s';
      // console.log('MEMEME111>>>', isNearToTarget , positionLenToCenter)
    } else if (isCloseToCenter) {
      activeCatchCircle.style.animationDuration = '12s';
      activeCatchCircle.style["-webkit-animation-duration"] = '12s';
      // console.log('MEMEME>>>', isCloseToCenter, positionLenToCenter)
      // removeEl(element.uuid);
    } else {
      // console.log('nonon', positionLenToCenter)
      catchCircle.style.display = 'block';
      activeCatchCircle.style.display = 'none';
    }
    catchBtn = document.getElementById('start-game-button');
    catchBtn.addEventListener('click', () => catchElement(eleToCatchId))
    animateFrame = window.requestAnimationFrame(() => animate(eleToCatchId, eleCaught));
  }

  const animate = (eleId, eleCatch) => {
    controls.update();
    trackCamera();
    renderer.render( scene, camera );
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  const createGoldElements = () => {
    for (let i = 0; i < 7; i += 1) {
      const randX = Math.random() * 20 - 10;
      const randY = Math.random() * 10 - 5;
      const randZ = Math.random() * -5 - 2;

      const { element, id } = eleTexture[i];
      const imgWidth = 83 / 100;
      const imgHeight = 105 / 100;
      
      const geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
      const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: element, alphaTest: 0.5 });
      material.magFilter = THREE.NearestFilter;
      material.minFilter = THREE.NearestFilter;
      
      const goldEl = new THREE.Mesh( geometry, material );
      goldEl.position.set(randX, randY, randZ)
      goldEl.name = id;
      // goldEl.name = goldEl.uuid;
      scene.add( goldEl );
    }
  }

  const init3D = () => {
    video = document.getElementById('rear-video');
    activeCatchCircle = document.getElementById('active-catch-circle');
    catchCircle = document.getElementById('catch-circle');
    video.play();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    scene = new THREE.Scene();
    controls = new DeviceOrientationControls( camera );

    camera.updateMatrixWorld();
    createGoldElements();

    const light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    const screen = document.getElementById('screen-game');
    screen.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    initCameraStream();
  }

  const handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
  }

  const initCameraStream = () => {
    const constraints = {
      audio: false,
      video: {
        width: window.innerWidth,
        height: window.innerHeight,
        facingMode: "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch((error) => {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      });
  }

  const hideTutorial = () => {
    const overlay = document.getElementById('overlay');
    const submitText = document.getElementsByClassName('submit-text')[0];
    const pulseCicle = document.getElementById('pulse-circle');
    const counter = document.getElementsByClassName('counter')[0];
    const previewContainer = document.getElementsByClassName('preview-container')[0];
    const highlightBox = document.getElementsByClassName('highlight-box')[0];
    overlay.classList.add('start-game');
    submitText.classList.add('hide');
    pulseCicle.classList.add('hide');
    highlightBox.classList.add('hide');
    counter.style.zIndex = 1;
    previewContainer.style.zIndex = 1;
  }

  useEffect(() => {
    console.log('did mount')
    if (!window.startApp) {
      history.replace('/');
    } else if (window.isAccessOrientationGranted) {
      console.log('did mount 2')
      init3D();
      animate(eleToCatchId, eleCaught);
    }

    // if (!window.selfieURI) {
    //   window.selfieURI = normalGirl;
    // }
    // setStartGame(1);
  }, [])

  useEffect(() => {
    if (counter > 0 && isGameStarted) {
    // if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter <= 0) {
      console.log(">>>>> display wipe up animation")
      timeUpAnimation();
    }
  }, [counter, isGameStarted]);

  useEffect(() => {
    if (isGameStarted) {
      hideTutorial();
    }
  }, [isGameStarted]);

  const renderBenefitArrow = (caughtId) => {
    const arBenefitLetter = document.getElementById('ar-benefit-letter');
    const arBenifitArrow = document.getElementById('ar-benifit-container');
    const selectedEle = eleTexture.find((ele) => ele.id === caughtId);

    arBenifitArrow.style.animation = 'arrow-animation 1.5s linear';
    arBenefitLetter.textContent = selectedEle.title;
    setTimeout(() => {
      arBenifitArrow.style.opacity = 0;
      arBenifitArrow.style.top = '26vh';
      arBenifitArrow.style.animation = 'none';
    }, 1000);
  }

  const updateProgess = (updatedProgess) => {
    const progresIndicator = document.getElementById('progress-indicator');
    const progressNumber = document.getElementById('progress-indicator-number');
    const selfieWinkles = document.getElementById('selfie-winkles');
    
    let progressPercent = Math.floor((100 - 25) / 7 * updatedProgess);
    if (progressPercent > 75) {
      progressPercent = 75;
    }
    const newProgress = progressPercent + 25
    const percent = `${newProgress}%`
    // setProgressLetter(newProgress);
    progressNumber.textContent = newProgress;
    progresIndicator.style.width = percent;
    selfieWinkles.style.opacity = (1 - (1/7) * updatedProgess);
  }

  return (
    <div id="screen-game" ref={screenRef}>
      <div className="top-section">
        <img className="brand-logo" src={BrandLogo} />
        <div className="highlight-box">
          <p>抗老逆龄教学</p>
        </div>
        <div className="counter">
          <CountdownCircleTimer
            isPlaying={counter < 60}
            duration={counter}
            size={40/752 * window.innerHeight}
            trailColor="transparent"
            strokeWidth={2}
            colors="#fff"
          >
          {({ elapsedTime }) =>
            <div id="countdown-number">
              {counter}<small>s</small>
            </div>
          }
        </CountdownCircleTimer>
        </div>
        <div className="preview-container">
          <div className="user-info">
            <div id="selfie-filter">
              <div className="selfie-bg">
                <img id="selfie-winkles" src={SelfieResultWinkles} />
                <img id="selfie-preview" src={window.selfieURI} />
              </div>
            </div>
            <div className="info-container">
              <div className="text-info">
                <p>你的抗老力:</p>
                <h3 id="progress-indicator-number">25</h3>
                <h4>%</h4>
              </div>
              <div className="meter-bar">
                <div className="meter-container">
                  <div className="meter">
                    <span id="progress-indicator"></span>
                  </div>
                </div>
              </div>
              <img id="play-info-bg" src={PlayInfoArea} />
            </div>
          </div>
        </div>
      </div>
      <div className="catch-container">
        <div id="ar-benifit-container">
          <img id="ar-benifit" src={ArBenifitArrow} />
          <p id="ar-benefit-letter">中和自由基</p>
        </div>
        <img id="catch-circle" src={CatchCircle} />
        <img id="active-catch-circle" src={ActiveCatchCircle} />
        <img id="catch-circle-bg" src={CatchCircleBg} />
        <div className="bottom-part">
          <div className="submit-text">
            <p>搜寻逆龄因子并按键捕捉</p>
            <img id="cta-arrow" src={CatchCTAArrow} />
          </div>
          <button id="start-game-button">
            <img src={CatchButton} />
            <div id="pulse-circle">
              <div className="circle pulse"></div>
              <div className="circle2 pulse"></div>
            </div>
          </button>
        </div>
      </div>
      <div id="ar-measure-bg">
        <img src={ArMeasureElement} />
      </div>
      <video id="rear-video" autoPlay playsInline></video>
      <div id="overlay"></div>
    </div>
  );
}

export default GamePage;
