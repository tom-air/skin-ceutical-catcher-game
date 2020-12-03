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
import ArBenifitArrow from '../../assets/ar_benifit.png';
import PlayInfoArea from '../../assets/player_info_area.png';
import ArMeasureElement from '../../assets/ar_measure_element.png';
import { createGlbElement, createGoldPicElements } from './loaderUtils';
import './game.css';

 const elementBenefits = ['中和\n自由基', '減退\n細紋', '預防\n光老化', '抗氧\n保護']

const GamePage = () => {
  let camera, scene, renderer, controls, video;
  let activeCatchCircle, catchCircle, catchBtn, progresIndicator;
  let animateFrame;

  const history = useHistory();

  const [isGameStarted, setStartGame] = useState(false);
  const [counter, setCounter] = useState(60);
  let eleToCatchId = '';
  let eleCaught = 0;

  const screenRef = useRef(null);

  const timeUpAnimation = () => {
    // window.cancelAnimationFrame(animateFrame);
    // if (catchBtn) {
    //   catchBtn.removeEventListener('click', () => {})
    // }
    animate(true)
  }

  const catchElement = (eleId) => {
    if (eleId) {
      let el = scene.getObjectByName(eleId)
      if (el) {
        eleCaught = eleCaught + 1;
        scene.remove(el);
        eleToCatchId = ''
        updateProgess(eleCaught);
        renderBenefitArrow(eleCaught);
        setStartGame(eleCaught);
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
  }

  const elementAnimation = (ele, i) => {
    const timer = 0.001 * Date.now();

    // if (ele.morphTargetInfluences && ele.morphTargetInfluences.length) {
    //   for (let i = 0; i < 4; i += 1) {
    //     const newMorph = Math.sin(timer + (i + 1) * 800000);
    //     ele.morphTargetInfluences[i] = newMorph;
    //   }
    // }

    if (eleCaught >= 1) {
      ele.position.y = ele.position.y + 0.03 * Math.sin(timer + i * 3);
    }
  }

  const trackCamera = (gameEnded) => {
    const threshold = 0.2;
    const minThreshold = 0.4;
    const sceneEls = scene.children;
    let isCloseToCenter = false;
    let isNearToTarget = false;
    let eleId = '';
    for (let i = 0; i < sceneEls.length; i ++) {
      const element = sceneEls[i];
      element.lookAt(camera.position);
      // element.quaternion.copy(camera.quaternion);
      if (element) {
        // console.log('***', element.vector)
        elementAnimation(element, i);
        const positionScreenSpace = element.position.clone().project(camera);
        positionScreenSpace.setZ(0);
        const positionLenToCenter = positionScreenSpace.length();
        if (positionLenToCenter < threshold) {
          isCloseToCenter = true;
          eleId = element.name;
        } else if (positionLenToCenter < minThreshold) {
          isNearToTarget = true;
          eleId = element.name;
        }
        
      }
      // scene.children[i].quaternion.copy(camera.quaternion);
    }
    
    eleToCatchId = eleId;
    if (isCloseToCenter) {
      catchCircle.style.display = 'none';
      activeCatchCircle.style.display = 'block';
      activeCatchCircle.style.animationDuration = '24s';
      activeCatchCircle.style["-webkit-animation-duration"] = '24s';
      // console.log('MEMEME111>>>', isNearToTarget , positionLenToCenter)
    } else {
      // console.log('nonon', positionLenToCenter)
      catchCircle.style.display = 'block';
      activeCatchCircle.style.display = 'none';
    }
    // catchBtn = document.getElementById('start-game-button');
    catchBtn.addEventListener('click', () => catchElement(eleToCatchId))
    animateFrame = window.requestAnimationFrame(() => animate(gameEnded, eleToCatchId, eleCaught));
  }

  const move = (mesh, speed) => {
    const d = mesh.position.x - camera.position.x;
    if (mesh.position.x > camera.position.x) {
      mesh.position.x -= Math.min(speed, d);
    }
  }

  const endAnimation = () => {
    // const sceneEls = scene.children;
    // console.log('>>>1111', sceneEls)
    // if (sceneEls && sceneEls.length) {
    //   for (let i = 0; i < sceneEls.length; i ++) {
    //     const element = sceneEls[i];
    //     move(element, 10)
    //   }
    // }
    // progresIndicator = document.getElementById('progress-indicator');
    // progresIndicator.style.width = '100%';
    setTimeout(() => {
      history.push('/share');
    }, 2000);
    // animateFrame = window.requestAnimationFrame(() => animate(true));
  }

  const animate = (isGameEnd, eleId, eleCatch) => {
    if (!isGameEnd) {
      trackCamera();
      controls.update();
      renderer.render(scene, camera);
    } else {
      endAnimation()
      // console.log('>>>>>endddddd>>', isGameEnd)
    }
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  const createGoldElements = async () => {
    const elementsPromise = []
    for (let i = 0; i < 20; i += 1) {
      // const { element, id } = eleTexture[i];
      const id = `gold-element-${i}`;
      try {
        // const goldEl = await createGlbElement(id);
        // elementsPromise.push(goldEl);
        const goldEl = createGoldPicElements(id);
        scene.add(goldEl);
      } catch (err) {
        console.log('page error>', err)
      }
      // goldEl.name = goldEl.uuid;
    }
    // Promise.all(elementsPromise).then((goldEl) => {
    //   goldEl.forEach((el) => {
    //     scene.add(el);
    //   })
    // })
  }

  const init3D = () => {
    video = document.getElementById('rear-video');
    catchBtn = document.getElementById('start-game-button');
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
    if (!window.startApp) {
      history.replace('/');
    } else if (window.isAccessOrientationGranted) {
      init3D();
      animate(false, eleToCatchId, eleCaught);
    }
    // setStartGame(1);
  }, [])

  useEffect(() => {
    if (counter > 0 && isGameStarted) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter <= 0) {
      timeUpAnimation();
    }
  }, [counter, isGameStarted]);

  useEffect(() => {
    if (isGameStarted) {
      hideTutorial();
    }
  }, [isGameStarted]);

  const renderBenefitArrow = (catchNum) => {
    const arBenefitLetter = document.getElementById('ar-benefit-letter');
    const arBenifitArrow = document.getElementById('ar-benifit-container');
    const benefitLabel = elementBenefits[catchNum % 4];

    arBenifitArrow.style.animation = 'arrow-animation 1.5s linear';
    arBenefitLetter.textContent = benefitLabel;
    setTimeout(() => {
      arBenifitArrow.style.opacity = 0;
      arBenifitArrow.style.top = '26vh';
      arBenifitArrow.style.animation = 'none';
    }, 1500);
  }

  const updateProgess = (updatedProgess) => {
    progresIndicator = document.getElementById('progress-indicator');
    const progressNumber = document.getElementById('progress-indicator-number');
    const selfieWinkles = document.getElementById('selfie-winkles');
    
    let progressPercent = Math.floor((100 - 25) / 7 * updatedProgess);
    if (progressPercent > 75) {
      progressPercent = 75;
    }
    const newProgress = progressPercent + 25
    const percent = `${newProgress}%`
    progressNumber.textContent = newProgress;
    progresIndicator.style.width = percent;
    selfieWinkles.style.opacity = (1 - (1/7) * updatedProgess);
  }

  return (
    <section id="screen-game" ref={screenRef}>
      <div className="top-section">
        <img className="brand-logo" src={BrandLogo} />
        <div className="highlight-box">
          <p>逆龄焕颜教学</p>
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
            <p>左右移动捕捉抗氧精华</p>
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
    </section>
  );
}

export default GamePage;
