import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import './index.css';
import App from './App';
import OrientationPage from './pages/OrientationPage';
// import reportWebVitals from './reportWebVitals';

const options = {
  position: 'top center',
  timeout: 200000,
  offset: '30px',
  transition: 'scale'
}

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <OrientationPage />
      <App />
      <div id="app-disclaimer">
        <p className="copy-right">
          Copyright © 2020.深圳市伊特利网络科技 | <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2020118183号-2</a>
        </p>
      </div>
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
