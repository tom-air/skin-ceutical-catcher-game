import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
import CatchButton from '../../assets/selfie_result_catch_btn.png';
import ReshootButton from '../../assets/selfie_result_reshoot_btn.png';
import CatchCTAArrow from '../../assets/selfie_result_cta_arrow.png';
import SelfieResultCircle from '../../assets/selfie_result_circle.png';
import Background from '../../assets/Selfie_result_bg.png';
import selfieResultGoldBg from '../../assets/gold_element_ani.gif';
// import selfieResultGoldBg from '../../assets/selfie_result_gold_bg.png';
import SelfieResultWinkles from '../../assets/selfie_result_wrinkle.png';
import './preview.css';

const PreviewPage = () => {
  const history = useHistory();
  const meterRef = useRef(null);
  const pageRef = useRef(null)
  let goldEleContainer;

  const unmount = () => {
    goldEleContainer.parentNode.removeChild(goldEleContainer);
  }

  useEffect(() => {
    if (!window.startApp) {
      history.replace('/');
    } else {
      const root = document.getElementById('root');
      goldEleContainer = document.createElement('div');
      goldEleContainer.style.backgroundImage = `url(${selfieResultGoldBg})`;
      goldEleContainer.style.position = 'absolute';
      goldEleContainer.style.top = 0;
      goldEleContainer.style.left = 0;
      goldEleContainer.style.bottom = 0;
      goldEleContainer.style.right = 0;
      goldEleContainer.style.backgroundRepeat = 'no-repeat';
      goldEleContainer.style.backgroundSize = 'cover';
      goldEleContainer.style.zIndex = -1;
      root.append(goldEleContainer);
      root.style.backgroundImage = 'none';
      root.style.backgroundImage = `url(${Background})`;
  
      return unmount;
    }
  }, []);
  
  useEffect(() => {
    if (meterRef.current) {
      meterRef.current.style.width = '25%';
    }
  }, [meterRef.current]);

  const onClickReshoot = () => {
    history.goBack();
  }

  return (
    <section id="screen-preview" ref={pageRef}>
      <div className="top-section">
        <img className="brand-logo" src={BrandLogo} />
        <div className="highlight-box">
          <p>没有使用抗氧化产品的你<br />皮肤氧化，皱纹加深</p>
        </div>
      </div>
      <div className="preview-container">
        <img id="result-circle" src={SelfieResultCircle} />
        <div className="container-bg"></div>
        <div id="selfie-filter">
          <img id="selfie-winkles" src={SelfieResultWinkles} />
          <img id="selfie-preview" src={window.selfieURI} />
        </div>
      </div>
      <div className="preview-info">
        <div className="text-info">
          <p>你的抗老力:</p>
          <h3>25</h3>
          <h4>%</h4>
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
          <p>立即开始提升抗氧力</p>
          <img id="cta-arrow" src={CatchCTAArrow} />
        </div>
      </div>
      <div className="bottom-section">
        <button id="start-game-button" onClick={() => { history.push('/game') }}>
          <img src={CatchButton} />
        </button>
        <button id="reshoot-button" onClick={onClickReshoot}>
          <img src={ReshootButton} />
          <p>重拍</p>
        </button>
      </div>
    </section>
  );
};

export default PreviewPage;
