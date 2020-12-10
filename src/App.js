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

  useEffect(() => {
    resize();
    window.addEventListener('resize orientationchange', resize);
  }, []);

  return (
    <Router>
      <Switch>
        <Suspense fallback={<LoadingPage />}>
          <Route path="/aoxmobilegame2020/share" exact>
            <SharePage />
          </Route>
          <Route path="/aoxmobilegame2020/game" exact>
            <GamePage />
          </Route>
          <Route path="/aoxmobilegame2020/preview" exact>
            <PreviewPage />
          </Route>
          <Route path="/aoxmobilegame2020/selfie" exact>
            <SelfiePage />
          </Route>
          <Route path="/aoxmobilegame2020" exact>
            <LandingPage />
          </Route>
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
