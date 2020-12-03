import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SelfiePage from './pages/SelfiePage';
import PreviewPage from './pages/PreviewPage';
import GamePage from './pages/GamePage';
import SharePage from './pages/SharePage';

const App = () => {
  const resize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const root = document.getElementById('root');
    root.style.width = window.innerWidth;
    root.style.height = window.innerHeight;
  }

  const getBaidu = () => {
    var _hmt = _hmt || [];
    (function() {
      const hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?92b71b85382d7e04bbfbf93b4320beb6";
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);

      // for SPA Tracking
      _hmt.push(['_requirePlugin', 'UrlChangeTracker', {
        shouldTrackUrlChange: function (newPath, oldPath) {
        return newPath && oldPath;
        }}
      ]);
    })();
  };

  useEffect(() => {
    getBaidu();
    resize();
    window.addEventListener('resize orientationchange', resize);
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/share">
          <SharePage />
        </Route>
        <Route path="/game">
          <GamePage />
        </Route>
        <Route path="/preview">
          <PreviewPage />
        </Route>
        <Route path="/selfie">
          <SelfiePage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
