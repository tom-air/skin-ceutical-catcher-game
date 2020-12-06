import React, { useEffect, useState, Suspense } from 'react';
import { useHistory } from 'react-router-dom';

import BrandLogo from '../../assets/Logo_white.png';
import './share.css';
import Background from '../../assets/Selfie_result_bg.png';
import faceBefore from '../../assets/prize_face_picture_before.png';
import faceAfter from '../../assets/prize_face_picture_after.png';
import wechat from '../../assets/wechat.svg';
import weibo from '../../assets/weibo.svg';
import copy from '../../assets/copy.svg';
// import PrizeCardCom from './PrizeCardCom';
import CopyToShare from './CopyToShare';
import { trackEvent } from '../../UtilHelpers';
import '../PreviewPage/preview.css';
import LoadingPage from '../LoadingPage';
import LoadingLogo from '../../assets/loading.png';
const PrizeCardCom = React.lazy(() => import('./PrizeCardCom'));

const SharePage = () => {
  let root, disclaimer, screen;
  const history = useHistory();
  const [pageLoaded, setLoaded] = useState(false);

  const unmount = () => {
    root.style.backgroundImage = 'none';
    root.style.overflowY = 'none';
    disclaimer.style.position = 'fixed';
    root.appendChild(disclaimer);
  }

  useEffect(() => {
    // if (!window.startApp) {
    //   history.replace('/');
    // } else {
    // }
    root = document.getElementById('root');
    root.style.backgroundImage = `url(${Background})`;
    root.style.overflowY = 'scroll';
    disclaimer = document.getElementById('app-disclaimer');
    screen = document.getElementById('screen-share');
    disclaimer.style.position = 'relative';
    screen.appendChild(disclaimer);
    return unmount;
  }, [])

  // useEffect(() => {
  //   if (pageLoaded) {
  //     const loadingScreen = document.getElementById('fix-loading');
  //     loadingScreen.style.display = 'none'
  //   }
  // }, [pageLoaded])

  const onClick = () => {
    trackEvent('button', 'click', 'return-home');
    window.location.href = '/';
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <section id="screen-share">
        <div className="top-section">
          <img className="brand-logo" src={BrandLogo} />
          <h2>恭喜你</h2>
          <div className="highlight-box">
            <p>提升满满抗老力 获享抗氧修护礼</p>
          </div>
        </div>
        <PrizeCardCom onPageLoad={() => setLoaded(true)}/>
        <div className="share-section">
          <p>长按储存图片，并分享至<br/>
          <img id="weibo" src={weibo} />微博或
          <img id="wechat" src={wechat} />微信朋友圈，带上话题</p>
          <CopyToShare msgToCopy="#修丽可##三亚国际免税城#">
            <div id="copy-hashtag">
              #修丽可##三亚国际免税城#
              <img src={copy} />
            </div>
          </CopyToShare>
          <p>前往三亚国际免税城修丽可专柜，
            <br />向美容顾问展示截图，
            <br />即可获得
            <span className="color-word">抗氧修护礼物一份</span>
            <br />(每个ID限拿一份)
          </p>
        </div>
        <div className="share-bottom-section">
          <div className="highlight-box">
            <div className="box-group">
              <h3 className="color-word">16</h3>
              <p>周*后，
                <span className="color-word">皱纹</span>显著减少
                <br />
                <span className="color-word">紧緻度</span>和
                <span className="color-word">整体肤质</span>显著提升
              </p>
            </div>
          </div>
          <div className="ref-pictures">
            <div className="picture-groups">
              <img src={faceBefore} />
              <img src={faceAfter} />
            </div>
            <small>
            *数据来源于修丽可科学研究。实验方法：为期16周科学测试，50名40-60岁被试者参与实验 （美国，2013年）。每天白天使用维生素CE复合修护精华液一次。被试者同时使用修丽可温和洁面乳每日两次，以及修丽可物理防晒霜和丰润保湿霜。实际效果因人而异。
            </small>
            <div className="active-btn" onClick={onClick}>
              <p>主页</p>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default SharePage;
