import React, { useEffect } from 'react';
import { config } from '../../UtilHelpers';
import './Loading.css';
import LoadingLogo from '../../assets/loading.png';
// const LoadingLogo = `${config.assetsUrl}/loading.png`;

const LoadingPage = () => (
  <section id="loading-screen">
    <img id="loading-logo" src={LoadingLogo} />
  </section>
);


export default LoadingPage;