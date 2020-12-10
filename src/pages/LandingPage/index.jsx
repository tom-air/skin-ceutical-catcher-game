import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { config, trackEvent, getDeviceOS } from '../../UtilHelpers';
import InApp from 'detect-inapp';
import LoadingPage from '../LoadingPage';
import AnimateBtn from './AnimateBtn';
import './landing.css';

const BrandLogo = `${config.assetsUrl}/Logo_white.png`;
const Background = `${config.assetsUrl}/landing_bg_md.png`;
// import PageModal from './PageModal';

const PageModal = React.lazy(() => import('./PageModal'));

const LandingPage = () => {
  const history = useHistory();
  const [pageIssue, setIssue] = useState('');
  const [pageLoad, setPageLoad] = useState(0);
  const [isPageFullyLoaded, setFullLoad] = useState(false);
  const [orientationEnabled, enableOri] = useState(false);
  const totalImage = 2;
  const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera);
  const OS = getDeviceOS(navigator.userAgent || navigator.vendor || window.opera);
  const browser = inapp.browser;

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
          history.push('/aoxmobilegame2020/selfie');
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
    const isViewInSafari = browser === 'safari';

    if (!isViewInSafari) {
      setIssue('must-safari');
      return true;
    }
    if (typeof DeviceOrientationEvent !== 'function') {
      alert(
        'Device is not supported for orientation, please try with mobile device',
      );
      return true;
    }
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      if (orientationEnabled) {
        window.isAccessOrientationGranted = true;
        getCameraAccess();
        return true;
      } else {
        setIssue('set-orientation');
        return true;
      }
    }
    DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        window.isAccessOrientationGranted = true;
        getCameraAccess();
        return true;
      }
    })
    .catch(console.error);
  }

  const getDeviceOrientationAccess = () => {
    const isIOS = OS === 'ios'; 

    if (browser === 'wechat') {
      setIssue('wechat');
    } else if (isIOS) {
      handleIOSPhone();
    } else {
      handleAndroidPhone();
    }
  }

  const updateDeviceOri = () => enableOri(true);

  useEffect(() => {
    window.addEventListener('deviceorientation', updateDeviceOri);
  }, [])

  useEffect(() => {
    if (orientationEnabled) {
      window.removeEventListener('deviceorientation', updateDeviceOri);
    }
  }, [orientationEnabled]);

  useEffect(() => {
    if (pageLoad === totalImage) {
      setFullLoad(true);
    }
  }, [pageLoad]);

  const onImgLoad = () => {
    const num = pageLoad + 1;
    setPageLoad(num);
  }

  const renderContent = () => (
    <section>
      {!isPageFullyLoaded && <LoadingPage />}
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
          <AnimateBtn
            title="开始体验"
            onClick={getDeviceOrientationAccess}
            onImgLoad={onImgLoad}
          />
        </div>
        <img id="landing-bg" src={Background} onLoad={onImgLoad} />
      {/* <img id="landing-mark" src={Landmark} /> */}
      </section>
      <div className="disclaimer">
        “CE经典抗氧瓶”为产品呢称，<br/>
        产品全称为修丽可维生素CE复合修护精华液；<br/>
        国妆特进字J20090391，<br/>
        专利号US,7179841
      </div>
    </section>
  );

  return (
    pageIssue ? (
      <PageModal page={pageIssue} />
    ) : (
      renderContent()
    )
  );
};

export default LandingPage;
