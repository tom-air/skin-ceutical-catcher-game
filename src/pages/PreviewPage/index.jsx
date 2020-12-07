import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
// import CatchButton from '../../assets/selfie_result_catch_btn.png';
import ReshootButton from '../../assets/selfie_result_reshoot_btn.png';
import CatchCTAArrow from '../../assets/selfie_result_cta_arrow.png';
import SelfieResultCircle from '../../assets/selfie_result_circle.png';
import Background from '../../assets/Selfie_result_bg.png';
// import selfieResultGoldBg from '../../assets/gold_element_ani.gif';
// import selfieResultGoldBg from '../../assets/selfie_result_gold_bg.png';
import SelfieResultWinkles from '../../assets/selfie_result_wrinkle.png';
// import StartBtn from '../../assets/landing_start btn.png';
import { trackEvent } from '../../UtilHelpers';
import './preview.css';
import gold1 from '../../assets/gold_elements/1.png';
import gold2 from '../../assets/gold_elements/2.png';
import gold3 from '../../assets/gold_elements/3.png';
import gold4 from '../../assets/gold_elements/4.png';
import gold5 from '../../assets/gold_elements/5.png';
import gold6 from '../../assets/gold_elements/6.png';
import gold7 from '../../assets/gold_elements/7.png';
import gold8 from '../../assets/gold_elements/8.png';
import gold9 from '../../assets/gold_elements/9.png';
import gold10 from '../../assets/gold_elements/10.png';
import gold11 from '../../assets/gold_elements/11.png';

const PreviewPage = () => {
  const history = useHistory();
  const meterRef = useRef(null);
  const pageRef = useRef(null)

  useEffect(() => {
    if (!window.startApp) {
      history.replace('/');
    } else {
      const root = document.getElementById('root');
      root.style.backgroundImage = 'none';
      root.style.backgroundImage = `url(${Background})`;
      root.style.backgroundRepeat = 'no-repeat';
      root.style.backgroundSize = 'cover';
      root.style.backgroundPosition = 'center';
    }
  }, []);
  
  useEffect(() => {
    if (meterRef.current) {
      meterRef.current.style.width = '25%';
    }
  }, [meterRef.current]);

  const onClickReshoot = () => {
    trackEvent('button', 'click', 'retake-selfie');
    history.goBack();
  }

  const onClick = () => {
    trackEvent('button', 'click', 'start-game');
    history.push('/game');
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
        {/* <button id="start-game-button" onClick={() => { history.push('/game') }}>
          <img src={CatchButton} />
        </button> */}
        <div className="start-game-btn" onClick={onClick}>
          <p>开始游戏</p>
        </div>
        <button id="reshoot-button" onClick={onClickReshoot}>
          <img src={ReshootButton} />
          <p>重拍</p>
        </button>
      </div>
      <div className="gold-element-bg">
        <img src={gold1} id="gld-1" />
        <img src={gold2} id="gld-2" />
        <img src={gold3} id="gld-3" />
        <img src={gold4} id="gld-4" />
        <img src={gold5} id="gld-5" />
        <img src={gold6} id="gld-6" />
        <img src={gold7} id="gld-7" />
        <img src={gold8} id="gld-8" />
        <img src={gold9} id="gld-9" />
        <img src={gold10} id="gld-10" />
        <img src={gold11} id="gld-11" />
      </div>
    </section>
  );
};

export default PreviewPage;
