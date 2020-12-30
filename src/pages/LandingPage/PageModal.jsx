import React, { useEffect } from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import { config } from '../../UtilHelpers';
import CopyToShare from '../SharePage/CopyToShare';
import StartBtnAni from '../../assets/start_btn_ani.png';
import ErrorMotionSensor from '../../assets/error_motion_sensor.png';
import Arrow from '../../assets/selfie_result_cta_arrow.png';
import Safari from '../../assets/safari.svg';
import Android from '../../assets/android.svg';
import Camera from '../../assets/camera.svg';
import Box from '../../assets/box.svg';
import Box2 from '../../assets/box2.svg';
import Box3 from '../../assets/box3.svg';
import BtnAni from '../../assets/btn_animate.gif';

// const StartBtnAni = `${config.assetsUrl}/start_btn_ani.png`;
// const ErrorMotionSensor = `${config.assetsUrl}/error_motion_sensor.png`;
// const Arrow = `${config.assetsUrl}/selfie_result_cta_arrow.png`;
// const Safari = `${config.assetsUrl}/safari.svg`;
// const Android = `${config.assetsUrl}/android.svg`;
// const BtnAni = `${config.assetsUrl}/btn_animate.gif`;

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
              <p>复制链接</p>
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
    case 'grant-orientation':
      pageContent = (
        <div className="switch-on-orientation">
          <div className="text-container">
            <img id="camera-issue" src={Camera} />
            <p id="issue-text">点选「允许」以允许访问相机</p>
            <div className="list-item">
              <div className="item-box">
                <img src={Box} />
              </div>
              <h5>重启浏览器</h5>
            </div>
            <div className="list-item">
              <div className="item-box">
                <img src={Box2} />
              </div>
              <h5>在浏览器中粘贴链接</h5>
            </div>
            <div className="list-item">
              <div className="item-box">
                <img src={Box3} />
              </div>
              <h5>允许移动和方向访问</h5>
            </div>
            <div id="site-link">https://skinceuticalstrasia.cn/aoxmobilegame2020</div>
            <CopyToShare target="site-link" msgToCopy="https://skinceuticalstrasia.cn/aoxmobilegame2020/">
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
                <p>复制链接</p>
              </div>
            </CopyToShare>
          </div>
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
