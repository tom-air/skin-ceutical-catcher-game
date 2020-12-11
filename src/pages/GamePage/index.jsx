import React from 'react';
import * as THREE from 'three';
import { withRouter } from 'react-router-dom';
import $ from "jquery";
import Spritesheet from 'react-responsive-spritesheet';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import { trackEvent, config } from '../../UtilHelpers';
import { createGoldPicElements } from './loaderUtils';
import VideoCanvas from '../SelfiePage/Video';
import './game.css';
// import '../PreviewPage/preview.css';
// import '../SelfiePage/selfie.css';

import BrandLogo from '../../assets/Logo_white.png';
import CatchCircle from '../../assets/ar_teach_catch_circle.png';
import ActiveCatchCircle from '../../assets/ar_active_catch_circle.png';
import CatchCircleBg from '../../assets/ar_catch_circle_bg.png';
import SelfieResultWinkles from '../../assets/selfie_result_wrinkle.png';
import ArBenifitArrow from '../../assets/ar_benifit.png';
import PlayInfoArea from '../../assets/player_info_area.png';
import TargetArrow from '../../assets/target_arrow.svg';
import ArMeasureElement from '../../assets/ar_measure_element.png';
import goldEle1 from '../../assets/serum1.png';
import mobileMoveAni from '../../assets/mobile_move_ani.png';
// const BrandLogo = `${config.assetsUrl}/Logo_white.png`;
// const CatchCircle = `${config.assetsUrl}/ar_teach_catch_circle.png`;
// const ActiveCatchCircle = `${config.assetsUrl}/ar_active_catch_circle.png`;
// const CatchCircleBg = `${config.assetsUrl}/ar_catch_circle_bg.png`;
// const SelfieResultWinkles = `${config.assetsUrl}/selfie_result_wrinkle.png`;
// const ArBenifitArrow = `${config.assetsUrl}/ar_benifit.png`;
// const PlayInfoArea = `${config.assetsUrl}/player_info_area.png`;
// const TargetArrow = `${config.assetsUrl}/target_arrow.svg`;
// const ArMeasureElement = `${config.assetsUrl}/ar_measure_element.png`;
// const goldEle1 = 'https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum1.png';
// const mobileMoveAni = `${config.assetsUrl}/mobile_move_ani.png`;
// const goldEle2 = 'https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum2.png';
// const goldEle3 = 'https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum3.png';
// const goldEle4 = 'https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/public/serum4.png';

const elementBenefits = ['中和\n自由基', '減退\n細紋', '預防\n光老化', '抗氧\n保護']

let video, camera, scene, controls, screen, track, renderer, animateFrame, raycaster;
let activeCatchCircle, catchCircle, arrowAni, arBenefitLetter, arBenifitArrow,
progresIndicator , progressNumber, selfieWinkles, pulseCicle, endGameAni, progressCount, selfiePreview;

class GamePage extends React.Component {
  isGameStarted = false;
  isGameEnded = false;
  numOfElementCaught = 0;
  targetEleId = '';
  intersects = [];
  showBenifitArrow = false;
  // videoRef = React.createRef();

  state = {
    counter: 60,
    videoRef: null,
  }

  componentDidMount() {
    if (!window.startApp) {
      this.props.history.replace('/aoxmobilegame2020');
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
    selfiePreview = $('#selfie-preview');
    pulseCicle = document.getElementById('circle2');
    endGameAni = document.getElementById('end-game-gold-element');
    progressCount = $('#progress-indicator-number');

    // video.play();
    if (!this.state.videoRef) {
      this.setState({ videoRef: video });
    }
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
    renderer.domElement.id = 'three-js-world';
    screen.appendChild(renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);
    this.initCameraStream();
    // raycaster = new THREE.Raycaster(camera.position, camera.getWorldDirection());
  }

  animate = (timeStamp) => {
    this.trackCamera();
    animateFrame = window.requestAnimationFrame(this.animate);
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
      if (this.isGameEnded) {
        element.position.set(0, 0, 0)
        if (!this.end) {
          endGameAni.classList.add('animate')
          const newProgress = 100;
          this.updateProgess(newProgress);
        }
        this.end = true;
      } else {
        element.lookAt(camera.position);
        element.quaternion.copy(camera.quaternion);
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
    if (this.numOfElementCaught >= 1) {
      ele.position.y += 0.005 * Math.sin(timer * i * 0.4);
      ele.position.x += 0.01 * Math.sin(timer * -i * 0.8);
      // ele.position.y += 0.015 * Math.sin(timer + i * 320000000);
      // ele.position.x += 0.015 * Math.sin(timer + -i * 640000000);
    }
  }

  createGoldElements = () => {
    for (let i = 0; i < 20; i += 1) {
      const id = `gold-element-${i}`;
      try {
        const goldEl = createGoldPicElements(id, i);
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
      this.props.history.push('/aoxmobilegame2020/share');
    }, 3800);
  }

  startCounter = () => {
    this.gameCounter = setInterval(() => {
      this.setState(({ counter }) => {
        if (counter > 0) {
          return ({
            counter: counter - 1
          })
        }
        trackEvent('button', 'click', 'game-time-up');
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
    const targetText = document.getElementById('target-text');
    overlay.classList.add('start-game');
    submitText.classList.add('hide');
    highlightBox.classList.add('hide');
    targetText.classList.add('hide');
    counter.style.zIndex = 1;
    previewContainer.style.zIndex = 1;
  }

  onCatchElement = () => {
    if (!this.targetEleId) return null;
    if (!this.showBenifitArrow) {
      this.removeElement();
      this.renderBenefitArrow();
      this.numOfElementCaught += 1;
      let progressPercent = Math.floor((100 - 25) / 7 * this.numOfElementCaught);
      if (progressPercent > 75) {
        progressPercent = 75;
      }
      const newProgress = progressPercent + 25;
      this.updateProgess(newProgress);
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
  
      if (el.material.opacity >= 0) {
        el.scale.x += timer * 4.5;
        el.scale.y += timer * 4.5;
        el.material.transparent = true;
        // set opacity to 50%
        el.material.opacity -= timer * 2.2;
      } else {
        scene.remove(el);
        el.geometry.dispose();
        el.material.dispose();
        this.elementOnCatch = null;
        this.removingElement = false;
      }
    }
  }

  removeElement = () => {
    this.removingElement = true;
  }

  resetCSSUpdates = () => {
    // arBenifitArrow.classList.remove('anime');
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
      // const arrow = aniArrow[0];
      // arrow.style.animation = 'none';
      // arrow.getClientRects();
      // arrow.style.animation = null;
      pulseCicle.style.animation = 'none';
      pulseCicle.getClientRects();
      pulseCicle.style.animation = null;
    } else {
      // arBenifitArrow.classList.add('anime');
      pulseCicle.classList.add('pulse');
    }
    arBenefitLetter.textContent = benefitLabel;
    arrowAni = setTimeout(this.resetCSSUpdates, 1500);
  }

  updateProgess = (newProgress) => {
    const percent = `${newProgress}%`;
    // progressNumber.textContent = newProgress;
    progressCount.prop('Counter', $(progressCount).text()).delay(800).animate({
      Counter: newProgress,
    }, {
      duration: 1000,
      // easing: 'swing',
      step: function () {
        $(progressCount).text(Math.ceil(this.Counter))
      }
    })
    const filters = selfiePreview.css('filter').split(" ");
    const [saturate, brightness] = filters;
    const curSaturate = Number(saturate.match(/[\d\.?]+/g)[0]);
    const curBrightness = Number(brightness.match(/[\d\.?]+/g)[0]);
    $({
      saturate: curSaturate,
      brightness: curBrightness,
    }).animate({
      saturate: curSaturate + 0.05,
      brightness: curBrightness + 0.05,
    }, {
      duration: 500,
      easing: 'swing',
      step: function() {
          selfiePreview.css({
              "-webkit-filter": 'saturate(' + this.saturate + ') brightness(' + this.brightness + ')',
              "filter": 'saturate(' + this.saturate + ') brightness(' + this.brightness + ')'
          });
      }
    });
    selfieWinkles.style.opacity = (1 - (1/7) * this.numOfElementCaught);
    pulseCicle.style.display = 'block';
    if (newProgress === 100) {
      pulseCicle.classList.remove('pulse');
      pulseCicle.classList.add('pulse2');
      progresIndicator.style.transitionDelay = '0.8s';
    }
    progresIndicator.style.width = percent;
    progresIndicator.style.boxShadow = '0px 0px 12px 6px #F7CC92';
  }

  render() {
    const { counter, videoRef } = this.state;
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
            <p id="target-text">点击</p>
          </div>
          <div className="bottom-part">
            <div className="submit-text">
              <div id="mobile-ani">
                <Spritesheet
                  image={mobileMoveAni}
                  widthFrame={152}
                  heightFrame={152}
                  steps={89}
                  fps={59}
                  autoplay
                  loop
                  isResponsive
                />
              </div>
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
        <div id="end-game-gold-element">
          <img src={goldEle1} className="gld-img" id="gld-1" />
          <img src={goldEle1} className="gld-img" id="gld-2" />
          <img src={goldEle1} className="gld-img" id="gld-3" />
          <img src={goldEle1} className="gld-img" id="gld-4" />
          <img src={goldEle1} className="gld-img" id="gld-5" />
          <img src={goldEle1} className="gld-img" id="gld-6" />
          <img src={goldEle1} className="gld-img" id="gld-7" />
          <img src={goldEle1} className="gld-img" id="gld-8" />
          <img src={goldEle1} className="gld-img" id="gld-9" />
          <img src={goldEle1} className="gld-img" id="gld-10" />
          <img src={goldEle1} className="gld-img" id="gld-11" />
        </div>
        <div id="ar-measure-bg">
          <img src={ArMeasureElement} />
        </div>
        {videoRef && <VideoCanvas video={videoRef} />}
        <video id="rear-video" autoPlay playsInline></video>
        <div id="overlay"></div>
      </section>
    );
  }
}

export default withRouter(GamePage);
