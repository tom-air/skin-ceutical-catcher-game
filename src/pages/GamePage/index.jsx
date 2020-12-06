import React from 'react';
import * as THREE from 'three';
import { withRouter } from 'react-router-dom';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import BrandLogo from '../../assets/Logo_white.png';
import CatchCircle from '../../assets/ar_teach_catch_circle.png';
import CatchCTAArrow from '../../assets/selfie_result_cta_arrow.png';
import ActiveCatchCircle from '../../assets/ar_active_catch_circle.png';
import CatchCircleBg from '../../assets/ar_catch_circle_bg.png';
import SelfieResultWinkles from '../../assets/selfie_result_wrinkle.png';
import ArBenifitArrow from '../../assets/ar_benifit.png';
import PlayInfoArea from '../../assets/player_info_area.png';
import TargetArrow from '../../assets/target_arrow.svg';
import ArMeasureElement from '../../assets/ar_measure_element.png';
import { createGoldPicElements } from './loaderUtils';
import { trackEvent } from '../../UtilHelpers';
import './game.css';
import '../PreviewPage/preview.css';

const elementBenefits = ['中和\n自由基', '減退\n細紋', '預防\n光老化', '抗氧\n保護']

let video, camera, scene, controls, screen, track, renderer, animateFrame, raycaster;
let activeCatchCircle, catchCircle, arrowAni, arBenefitLetter, arBenifitArrow,
progresIndicator , progressNumber, selfieWinkles, pulseCicle;

class GamePage extends React.Component {
  isGameStarted = false;
  isGameEnded = false;
  numOfElementCaught = 0;
  targetEleId = '';
  intersects = [];
  showBenifitArrow = false;

  state = {
    counter: 60,
  }

  componentDidMount() {
    if (!window.startApp) {
      this.props.history.replace('/');
    } else if (window.isAccessOrientationGranted) {
      this.init3D();
      window.requestAnimationFrame(this.animate);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animateFrame);
    clearInterval(this.gameCounter);
  }

  init3D = () => {
    video = document.getElementById('rear-video');
    // catchBtn = document.getElementById('start-game-button');
    activeCatchCircle = document.getElementById('active-catch-circle');
    catchCircle = document.getElementById('catch-circle');
    arBenefitLetter = document.getElementById('ar-benefit-letter');
    arBenifitArrow = document.getElementById('ar-benifit-container');
    progresIndicator = document.getElementById('progress-indicator');
    progressNumber = document.getElementById('progress-indicator-number');
    selfieWinkles = document.getElementById('selfie-winkles');
    pulseCicle = document.getElementById('circle2');
  
    video.play();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    scene = new THREE.Scene();
    controls = new DeviceOrientationControls(camera);

    camera.updateMatrixWorld();
    this.createGoldElements();

    const light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    screen = document.getElementById('screen-game');
    screen.appendChild(renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);
    this.initCameraStream();
    // raycaster = new THREE.Raycaster(camera.position, camera.getWorldDirection());
  }

  animate = (timeStamp) => {
    animateFrame = window.requestAnimationFrame(this.animate);
    this.trackCamera();
    this.removeEleAnimation()
    controls.update();
    renderer.render(scene, camera);
  }

  detectTargetInAim = (element) => {
    raycaster = new THREE.Raycaster(camera.position, camera.getWorldDirection());
    raycaster.params.Points.threshold = 20;
    raycaster.params.Line.threshold = 20;
    raycaster.params.Mesh.threshold = 20;
    this.intersects = raycaster.intersectObjects(element);
	  if (this.intersects && this.intersects[0]) {
      catchCircle.style.display = 'none';
      activeCatchCircle.style.display = 'block';
      activeCatchCircle.style.animationDuration = '16s';
      activeCatchCircle.style["-webkit-animation-duration"] = '16s';
      this.targetEleId = this.intersects[0].object.name;
    } else {
      catchCircle.style.display = 'block';
      activeCatchCircle.style.display = 'none';
      this.targetEleId = '';
    }
  }

  trackCamera = () => {
    const threshold = 0.1;
    const minThreshold = 0.4;
    const sceneEls = scene.children;
    let elesToCatch = [];
    // this.detectTargetInAim(sceneEls)
    for (let i = 0; i < sceneEls.length; i ++) {
      const element = sceneEls[i];
      element.lookAt(camera.position);
      this.elementAnimation(element, i);
      const positionScreenSpace = element.position.clone().project(camera);
      positionScreenSpace.setZ(0);
      const positionLenToCenter = positionScreenSpace.length();
      if (positionLenToCenter < threshold) {
        elesToCatch.push({
          eleId: element.name,
          distance: positionLenToCenter,
        });
      }
    }
    if (elesToCatch.length) {
      this.targetEleId = elesToCatch.sort((a, b) => a.distance - b.distance)[0].eleId;
    } else {
      this.targetEleId = '';
    }
    if (this.targetEleId) {
      catchCircle.style.display = 'none';
      activeCatchCircle.style.display = 'block';
      activeCatchCircle.style.animationDuration = '16s';
      activeCatchCircle.style["-webkit-animation-duration"] = '16s';
    } else {
      catchCircle.style.display = 'block';
      activeCatchCircle.style.display = 'none';
    }
  }

  elementAnimation = (ele, i) => {
    const timer = 0.001 * Date.now();

    if (this.isGameEnded) {
      // const factor = 0.0000000001 * timer;
      // // ele.position.x += factor;
      // const d = ele.position.x - camera.position.x;
      // if (ele.position.x > camera.position.x) {
      //   ele.position.x -= factor;
      //   // ele.position.x -= Math.min(1000, d);
      // }
      // if (ele.position.y > camera.position.y) {
      //   ele.position.y -= factor;
      //   // ele.position.x -= Math.min(1000, d);
      // }
      // ele.position.y += factor;
      // ele.position.z -= factor;
    } else if (this.numOfElementCaught >= 1) {
      ele.position.y += 0.005 * Math.sin(timer + i * 300);
      ele.position.x += 0.005 * Math.sin(timer + -i * 3000);
    }
  }

  createGoldElements = () => {
    for (let i = 0; i < 20; i += 1) {
      const id = `gold-element-${i}`;
      try {
        const goldEl = createGoldPicElements(id);
        scene.add(goldEl);
      } catch (err) {
        console.log('page error>', err)
      }
    }
  }

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  handleSuccess = (stream) => {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;

    track = stream.getTracks()[0];
  }

  initCameraStream = () => {
    const constraints = {
      audio: false,
      video: {
        // width: window.innerWidth,
        // height: window.innerHeight,
        width: { exact: window.innerHeight },
        height: { exact: window.innerWidth },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.handleSuccess)
      .catch((error) => {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
      });
  }

  startGame = () => {
    this.isGameStarted = true;
    this.startCounter();
    this.hideTutorial();
  }

  stopGame = () => {
    this.isGameEnded = true;
    clearInterval(this.gameCounter);
    setTimeout(() => {
      this.props.history.push('/share');
    }, 1500);
  }

  // endAnimation = () => {
  //   const timer = 0.0000000000001 * Date.now();
  //   if (this.isGameEnded) {
  //     const sceneEls = scene.children;
  //     for (let i = 0; i < sceneEls.length; i ++) {
  //       const element = sceneEls[i];
  //       element.position.set()
  //   }
  // }

  startCounter = () => {
    this.gameCounter = setInterval(() => {
      this.setState(({ counter }) => {
        if (counter > 0) {
          return ({
            counter: counter - 1
          })
        }
        this.stopGame();
      })
    }, 1000)
  }

  hideTutorial = () => {
    const overlay = document.getElementById('overlay');
    const submitText = document.getElementsByClassName('submit-text')[0];
    const counter = document.getElementsByClassName('counter')[0];
    const previewContainer = document.getElementsByClassName('preview-container')[0];
    const highlightBox = document.getElementById('high-box');
    overlay.classList.add('start-game');
    submitText.classList.add('hide');
    highlightBox.classList.add('hide');
    counter.style.zIndex = 1;
    previewContainer.style.zIndex = 1;
  }

  onCatchElement = () => {
    if (!this.targetEleId) return null;
    if (!this.showBenifitArrow) {
      this.numOfElementCaught += 1;
      this.removeElement();
      this.renderBenefitArrow();
      this.updateProgess();
      this.elementOnCatch = scene.getObjectByName(this.targetEleId);
      if (this.numOfElementCaught === 1) {
        this.startGame();
        trackEvent('button', 'click', 'catch-all-1st-elements');
      }
      if (this.numOfElementCaught === 7) {
        this.stopGame();
        trackEvent('button', 'click', 'catch-all-7-elements');
      }
    }
  }

  removeEleAnimation = () => {
    if (this.removingElement && this.elementOnCatch) {
      const el = this.elementOnCatch;
      const timer = 0.00000000000001 * Date.now();
  
      const scale = 1 + timer * 10;
      if (el.material.opacity > 0) {
        el.scale.set(scale, scale, scale)
        el.material.transparent = true;
        // set opacity to 50%
        el.material.opacity -= timer;
      } else {
        this.elementOnCatch = null;
        this.removingElement = false;
      }
    }
  }

  removeElement = () => {
    this.removingElement = true;
  }

  resetCSSUpdates = () => {
    arBenifitArrow.classList.remove('anime');
    pulseCicle.classList.remove('pulse');
    progresIndicator.style.boxShadow = '0px 0px 4px #391000D8';
    this.showBenifitArrow = false;
  }

  renderBenefitArrow = () => {
    const benefitLabel = elementBenefits[this.numOfElementCaught % 4];
    
    const aniArrow = document.getElementsByClassName('anime');
    this.showBenifitArrow = true;
    if (aniArrow.length) {
      clearTimeout(arrowAni);
      const arrow = aniArrow[0];
      arrow.style.animation = 'none';
      arrow.getClientRects();
      arrow.style.animation = null;
      pulseCicle.style.animation = 'none';
      pulseCicle.getClientRects();
      pulseCicle.style.animation = null;
    } else {
      arBenifitArrow.classList.add('anime');
      pulseCicle.classList.add('pulse');
    }
    arBenefitLetter.textContent = benefitLabel;
    arrowAni = setTimeout(this.resetCSSUpdates, 1500);
  }

  updateProgess = () => {
    let progressPercent = Math.floor((100 - 25) / 7 * this.numOfElementCaught);
    if (progressPercent > 75) {
      progressPercent = 75;
    }
    const newProgress = progressPercent + 25
    const percent = `${newProgress}%`
    progressNumber.textContent = newProgress;
    progresIndicator.style.width = percent;
    progresIndicator.style.boxShadow = '0px 0px 12px 6px #F7CC92';
    selfieWinkles.style.opacity = (1 - (1/7) * this.numOfElementCaught);
    pulseCicle.style.display = 'block';
  }

  render() {
    const { counter } = this.state;

    return (
      <section id="screen-game">
        <div className="top-section">
          <img className="brand-logo" src={BrandLogo} />
          <div className="highlight-box" id="high-box">
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
                <div id="pulse-circle">
                  {/* <div className="circle pulse"></div> */}
                  <div id="circle2"></div>
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
          <div className="target-container" onClick={this.onCatchElement}>
            <img id="catch-circle" src={CatchCircle} />
            <img id="active-catch-circle" src={ActiveCatchCircle} />
            <img id="catch-circle-bg" src={CatchCircleBg} />
            <img id="arrow-top" src={TargetArrow} />
            <img id="arrow-bottom" src={TargetArrow} />
            <img id="arrow-left" src={TargetArrow} />
            <img id="arrow-right" src={TargetArrow} />
          </div>
          <div className="bottom-part">
            <div className="submit-text">
              <img id="cta-arrow" src={CatchCTAArrow} />
              <p>左右移动捕捉抗氧精华</p>
            </div>
            {/* <button id="start-game-button">
              <img src={CatchButton} />
              <div id="pulse-circle">
                <div className="circle pulse"></div>
                <div className="circle2 pulse"></div>
              </div>
            </button> */}
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
}

export default withRouter(GamePage);
