import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
import CatchButton from '../../assets/selfie_result_catch_btn.png';
import ReshootButton from '../../assets/selfie_result_reshoot_btn.png';
import CatchCTAArrow from '../../assets/selfie_result_cta_arrow.png';
import SelfieResultCircle from '../../assets/selfie_result_circle.png';
import Background from '../../assets/Selfie_result_bg.png';
import './preview.css';

const PreviewPage = () => {
  const history = useHistory();
  const meterRef = useRef(null);
  const pageRef = useRef(null)

  useEffect(() => {
    if (!window.startApp) {
      history.replace('/');
    }

    const root = document.getElementById('root');
    root.style.backgroundImage = `url(${Background})`;

    console.log('(((+++', window.pageYOffset, window.selfieURI);
  }, []);

  useEffect(() => {
    if (pageRef.current && pageRef.current.offsetTop === 0) {
      console.log('MEMEME', pageRef, window.pageYOffset, pageRef.current.offsetTop)
      // window.scrollTo(0, 1);
      pageRef.current.scrollTo(0, 1);
    }
  }, [pageRef.current])
  
  useEffect(() => {
    if (meterRef.current) {
      meterRef.current.style.width = '25%';
    }
  }, [meterRef.current]);

  const drawImage = () => {
    const canvas = document.createElement('selfie-preview');
    const selfieCanvas = document.getElementById('preview-container');
    // const input = document.getElementById('video');
    canvas.width = selfieCanvas.offsetWidth;
    canvas.height = selfieCanvas.offsetHeight;
    canvas.getContext('2d').drawImage(window.selfieURI, 0, 0, canvas.width, canvas.height);
  }

  return (
    <section id="screen-preview" ref={pageRef}>
      <div className="top-section">
        <img className="brand-logo" src={BrandLogo} />
        <div className="highlight-box">
          <p>没有使用抗氧化产品的<br />你皮肤老，皱纹加深..</p>
        </div>
      </div>
      <div className="preview-container">
        <img id="result-circle" src={SelfieResultCircle} />
        <div className="container-bg"></div>
        <canvas id="selfie-preview"></canvas>
      </div>
      <div className="preview-info">
        <div className="text-info">
          <p>你的抗老力:</p>
          <h3>25%</h3>
        </div>
        <div className="meter-bar">
          <p>低</p>
            <div className="meter-container">
              <div className="meter">
                <span ref={meterRef}></span>
              </div>
            </div>
          <p>高</p>
        </div>
        <div className="submit-text">
          <p>立即提升抗老力</p>
        </div>
      </div>
      <div className="bottom-section">
        <button id="start-game-button" onClick={() => {}}>
          <img src={CatchButton} />
        </button>
      </div>
    </section>
  );
};

export default PreviewPage;
