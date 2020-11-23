import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SelfiePage from './pages/SelfiePage';

function App() {
  return (
    <Router>
      <Switch>
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
