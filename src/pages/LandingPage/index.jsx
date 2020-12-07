import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const { detect } = require('detect-browser');
import BrandLogo from '../../assets/Logo_white.png';
import Background from '../../assets/landing_bg_md.png';
// import BackgroundX from '../../assets/landing_bg_x.png';
// import BackgroundMd from '../../assets/landing_bg_md.png';
// import Landmark from '../../assets/landing_mark.png';
import PageModal from './PageModal';
import DefaultBg from '../../assets/Selfie_result_bg.png';
import BtnAni from '../../assets/btn_animate.gif';
import { trackEvent, isIOS, isWithinWeChat } from '../../UtilHelpers';
import './landing.css';

const LandingPage = () => {
  let root;
  const history = useHistory();
  const [pageIssue, setIssue] = useState('');
  const browser = detect();
  const isViewInSafari = browser && browser.name === 'safari';

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
          trackEvent('button', 'click', 'start-experience');
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

  const handleAndroidPhone = () => {
    window.isAccessOrientationGranted = true;
    getCameraAccess();
  }

  const handleIOSPhone = () => {
    if (!isViewInSafari) {
      setIssue('must-safari');
    } else if (DeviceOrientationEvent.requestPermission) {
      DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.isAccessOrientationGranted = true;
          getCameraAccess();
        }
      })
      .catch(console.error);
    } else {
      // root.append()
      alert(
        'Device is not supported for orientation, please try with mobile device',
      );
    }
  }

  const getDeviceOrientationAccess = () => {
    const isAndroid = !isIOS(); 

    // if (isWithinWeChat) {
    //   setIssue('wechat');
    // } else
    console.log('>>>>>>>', isAndroid)
    if (!isAndroid) {
      handleIOSPhone();
    } else {
      handleAndroidPhone();
    }
  }

  const unmount = () => {
    root.style.backgroundImage = `url(${DefaultBg})`;
  }

  useEffect(() => {
    root = document.getElementById('root');
    // const bgImg = Background;
    // if (window.innerWidth )
    root.style.backgroundImage = `url(${Background})`;
    return unmount;
  }, []);

  return (
    pageIssue ? (
      <PageModal page={pageIssue} />
    ) : (
      <>
        <section id="screen-loading">
          <div className="top-container">
            <img className="brand-logo" src={BrandLogo} />
            {/* <div className="title-group">
              <h3 className="title en">the antioxidant authority</h3>
              <h3 className="title ch">修丽可抗氧焕颜之旅</h3>
            </div>
            <div className="subtitle">
              <p>收集抗氧权威精华 体验肌肤逆龄焕颜</p>
              <div className="bg-container"></div>
            </div> */}
            <div id="land-title" />
            <div className="start-btn" onClick={getDeviceOrientationAccess}>
              <img className="start-btn-img" src={BtnAni} />
              <p>开始体验</p>
            </div>
          </div>
        {/* <img id="landing-mark" src={Landmark} /> */}
        </section>
        <div className="disclaimer">
          “CE经典抗氧瓶”为产品呢称，<br/>
          产品全称为修丽可维生素CE复合修护精华液；<br/>
          国妆特进字J20090391，<br/>
          专利号US,7179841
        </div>
      </>
    )
  );
};

export default LandingPage;
