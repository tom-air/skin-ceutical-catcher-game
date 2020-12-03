import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SelfiePage from './pages/SelfiePage';
import PreviewPage from './pages/PreviewPage';
import GamePage from './pages/GamePage';
import SharePage from './pages/SharePage';

const App = () => {
  const resize = () => {
    // console.log("resize");
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
