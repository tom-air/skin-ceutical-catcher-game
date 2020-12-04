import React, { useEffect } from 'react';
import './Loading.css';
import LoadingLogo from '../../assets/loading.png';

const LoadingPage = () => (
  <section id="screen-loading">
    <img id="loading-logo" src={LoadingLogo} />
  </section>
)


export default LoadingPage;