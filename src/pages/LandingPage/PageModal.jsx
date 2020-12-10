import React, { useEffect } from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import { config } from '../../UtilHelpers';
import CopyToShare from '../SharePage/CopyToShare';

const StartBtnAni = `${config.assetsUrl}/start_btn_ani.png`;
const ErrorMotionSensor = `${config.assetsUrl}/error_motion_sensor.png`;
const Arrow = `${config.assetsUrl}/selfie_result_cta_arrow.png`;
const Safari = `${config.assetsUrl}/safari.svg`;
const Android = `${config.assetsUrl}/android.svg`;
const BtnAni = `${config.assetsUrl}/btn_animate.gif`;

const PageModal = (props) => {
  const { page } = props;
  useEffect(() => {
    // const disclaimer = document.getElementById('disclaimer');
    const appDisclaimer = document.getElementById('app-disclaimer');
    // disclaimer.style.display = 'none';
    appDisclaimer.style.display = 'none';
  }, [])

  let pageContent;

  switch (page) {
    case 'wechat': 
      pageContent = (
        <>
          <img id="pointer-arrow" src={Arrow} />
          <div className="info-group">
            <div className="info">
              <img id="safari-info" src={Safari} />
              <p>iOS用户请按此并选择<br/>“在Safari中开启”</p>
            </div>
            <div className="info">
              <img id="android-info" src={Android} />
              <p>安卓用户<br/>请在浏览器开启</p>
            </div>
          </div>
        </>
      );
      break;
    case 'must-safari':
      pageContent = (
        <div className="must-in-safari">
          <img id="safari-info" src={Safari} />
          <p>在浏览器中<br />打开链接开始游戏</p>
          <div id="site-link">https://skinceuticalstrasia.cn/aoxmobilegame2020</div>
          <CopyToShare target="site-link" msgToCopy="https://skinceuticalstrasia.cn/aoxmobilegame2020/">
            {/* <div className="start-btn">
              <img className="start-btn-img" src={BtnAni} />
              <p>复制链接</p>
            </div> */}
            <div className="start-game-btn">
              <Spritesheet
                image={StartBtnAni}
                widthFrame={402}
                heightFrame={122}
                steps={60}
                fps={45}
                autoplay
                loop
                isResponsive
              />
              <p>开始游戏</p>
            </div>
          </CopyToShare>
        </div>
      );
      break;
    case 'set-orientation':
      pageContent = (
        <div className="switch-on-orientation">
          <img id="orientation-guide" src={ErrorMotionSensor} />
        </div>
      );
      break;
    default:
      pageContent = (
        <div>detecting</div>
      );
      break;
  }

  return (
    <section id="page-issue">
      {pageContent}
    </section>
  );
};

export default PageModal;
