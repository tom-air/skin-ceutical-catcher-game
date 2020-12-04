import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import LoadingPage from './pages/LoadingPage';
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const SelfiePage = React.lazy(() => import('./pages/SelfiePage'));
const PreviewPage = React.lazy(() => import('./pages/PreviewPage'));
const GamePage = React.lazy(() => import('./pages/GamePage'));
const SharePage = React.lazy(() => import('./pages/SharePage'));

const App = () => {
  const resize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const root = document.getElementById('root');
    root.style.width = window.innerWidth;
    root.style.height = window.innerHeight;
  }

  const getBaidu = () => {
    if (process.env.NODE_ENV !== 'production') return null;
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
        <Suspense fallback={<LoadingPage />}>
          <Route path="/share" exact>
            <SharePage />
          </Route>
          <Route path="/game" exact>
            <GamePage />
          </Route>
          <Route path="/preview" exact>
            <PreviewPage />
          </Route>
          <Route path="/selfie" exact>
            <SelfiePage />
          </Route>
          <Route path="/" exact>
            <LandingPage />
          </Route>
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
