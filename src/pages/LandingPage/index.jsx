import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BrandLogo from '../../assets/Logo_white.png';
import './landing.css';

const LandingPage = () => {
  const history = useHistory();

  useEffect(() => {
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
        })
        .catch((error) => {
          console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
        });
    } else {
      alert(
        'Mobile camera is not supported by browser, or there is no camera detected/connected',
      );
    }
  }, []);

  const startGame = () => {
    if (window.isCameraAccessAllowed) {
      window.startApp = true;
      history.push('/selfie');
    } else {
      alert(
        'Mobile camera is not supported by browser, or there is no camera detected/connected',
      );
    }
  }

  return (
    <section id="screen-loading">
      <div class="top-container">
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
      <div className="disclaimer">
        *“CE经典抗氧瓶”为产品眤称，
        产品全称为维生素CE复合精华液，
        国妆特进药字J20090391，
        专利号US,7179841。
      </div>
    </section>
  );
};

export default LandingPage;
