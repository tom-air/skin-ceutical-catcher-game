import React, { useEffect } from 'react';
import LoadingLogo from '../../assets/loading.png';
import DefaultBg from '../../assets/Selfie_result_bg.png';
import './Loading.css';

const LoadingPage = () => {
  useEffect(() => {
    const loading = document.getElementById('loading-logo');
    loading.style.display = 'block';
  }, [])
  return (
    <section id="loading-screen">
      <img id="loading-logo" src={LoadingLogo} />
    </section>
  )
}


export default LoadingPage;