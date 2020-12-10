import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Spritesheet from 'react-responsive-spritesheet';
import { config, trackEvent } from '../../UtilHelpers';
import './preview.css';
import LoadingPage from '../LoadingPage';
const StartBtnAni = `${config.assetsUrl}/start_btn_ani.png`;
const BrandLogo = `${config.assetsUrl}/Logo_white.png`;
const ReshootButton = `${config.assetsUrl}/selfie_result_reshoot_btn.png`;
const CatchCTAArrow = `${config.assetsUrl}/selfie_result_cta_arrow.png`;
const SelfieResultCircle = `${config.assetsUrl}/selfie_result_circle.png`;
const Background = `${config.assetsUrl}/Selfie_result_bg.png`;
const SelfieResultWinkles = `${config.assetsUrl}/selfie_result_wrinkle.png`;
const gold1 = `${config.assetsUrl}/gold_elements_1.png`;
const gold2 = `${config.assetsUrl}/gold_elements_2.png`;
const gold3 = `${config.assetsUrl}/gold_elements_3.png`;
const gold4 = `${config.assetsUrl}/gold_elements_4.png`;
const gold5 = `${config.assetsUrl}/gold_elements_5.png`;
const gold6 = `${config.assetsUrl}/gold_elements_6.png`;
const gold7 = `${config.assetsUrl}/gold_elements_7.png`;
const gold8 = `${config.assetsUrl}/gold_elements_8.png`;
const gold9 = `${config.assetsUrl}/gold_elements_9.png`;
const gold10 = `${config.assetsUrl}/gold_elements_10.png`;
const gold11 = `${config.assetsUrl}/gold_elements_11.png`;

const PreviewPage = () => {
  const history = useHistory();
  const meterRef = useRef(null);
  const [pageLoad, setPageLoad] = useState(false);
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
    history.push('/aoxmobilegame2020/game');
  }

  const onImgLoad = () => {
    setPageLoad(true);
  }

  return (
    <>
      {!pageLoad && <LoadingPage />}
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
          <div className="start-game-btn" onClick={onClick}>
            <Spritesheet
              image={StartBtnAni}
              widthFrame={402}
              heightFrame={122}
              steps={60}
              fps={45}
              onPlay={onImgLoad}
              autoplay
              loop
              isResponsive
            />
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
    </>
  );
};

export default PreviewPage;
