import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
// import Background from '../../assets/Landing_bg.png';
import Background from '../../assets/landing_bg_mb.png';
import Landmark from '../../assets/landing_mark.png';
import './landing.css';

const LandingPage = () => {
  const history = useHistory();

  const getCameraAccess = () => {
    const constraints = {
      audio: false,
      video: true,
    };

    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(() => {
          window.isCameraAccessAllowed = true;
          window.startApp = true;
          history.push('/selfie');
        })
        .catch((error) => {
          console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
        });
    } else {
      alert(
        'Mobile camera is not supported by browser, or there is no camera detected/connected',
      );
    }
  }

  const getDeviceOrientationAccess = () => {
    if (DeviceOrientationEvent.requestPermission) {
      DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log('granttedd')
          window.isAccessOrientationGranted = true;
          getCameraAccess();
        }
      })
      .catch(console.error);
    } else {
      alert(
        'Device is not supported for orientation, please try with mobile device',
      );
    }
  }

  useEffect(() => {
    // getCameraAccess();
    const root = document.getElementById('root');
    root.style.backgroundImage = `url(${Background})`;
  }, []);

  const startGame = () => {
    // getCameraAccess();
    getDeviceOrientationAccess()
    // if (window.isCameraAccessAllowed) {
    //   window.startApp = true;
    //   history.push('/game');
    //   // history.push('/selfie');
    // } else {
    //   alert(
    //     'Mobile camera is not supported by browser, or there is no camera detected/connected',
    //   );
    // }
  }

  return (
    <>
      <section id="screen-loading">
        <div className="top-container">
          <img className="brand-logo" src={BrandLogo} />
          <div className="title-group">
            <h3 className="title en">the antioxidant authority</h3>
            <h3 className="title ch">修丽可抗氧魔镜</h3>
          </div>
          <div className="subtitle">
            <p>收集皇牌逆龄因子 体验抗氧修护术</p>
            <div className="bg-container"></div>
          </div>
          <div className="start-btn" onClick={startGame}>
            <p>开始体验</p>
            <div className="btn-bg"></div>
          </div>
        </div>
        <img id="landing-mark" src={Landmark} />
      </section>
      <div className="disclaimer">
        *“CE经典抗氧瓶”为产品眤称，<br/>
        产品全称为维生素CE复合精华液，<br/>
        国妆特进药字J20090391，<br/>
        专利号US,7179841。
      </div>
    </>
  );
};

export default LandingPage;
