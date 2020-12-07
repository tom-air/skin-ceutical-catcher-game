import React from 'react';
import SafariFallBack from '../../assets/safari-fallback.png';

const DeviceMotion = () => (
  <section id="screen-device-motion">
    <img id="safari-fallback" src={SafariFallBack} />
    <div className="error-content">
      <p>You're almost there!</p>
      <p>To view this experience, please update to a newer version of iOS.</p>
    </div>
  </section>
);

export default DeviceMotion;