import React, { useEffect } from 'react';
import Arrow from '../../assets/selfie_result_cta_arrow.png';
import Safari from '../../assets/safari.svg';
import Android from '../../assets/android.svg';
import BtnAni from '../../assets/btn_animate.gif';
import CopyToShare from '../SharePage/CopyToShare';
import ErrorMotionSensor from '../../assets/error_motion_sensor.png';

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
          <div id="site-link">https://skinceuticalstrasia.cn/</div>
          <CopyToShare target="site-link" msgToCopy="https://skinceuticalstrasia.cn/">
            <div className="start-btn">
              <img className="start-btn-img" src={BtnAni} />
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
