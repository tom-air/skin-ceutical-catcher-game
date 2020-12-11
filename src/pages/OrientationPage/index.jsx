import React from 'react';
import InApp from 'detect-inapp';
import { config } from '../../UtilHelpers';

import Desktop from '../../assets/desktop.png';
import Landscape from '../../assets/landscape.png';
// const Desktop = `${config.assetsUrl}/desktop.png`;
// const Landscape = `${config.assetsUrl}/landscape.png`;

const OrientationPage = () => {
  const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera);

  const isDesktop = inapp.isDesktop;
  const Background = isDesktop ? Desktop : Landscape;
  return (
    <section
      id="orientation-screen"
      style={{
        display: 'none',
        // backgroundImage: `url(${Background})`,
        // backgroundSize: 'cover',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        // backgroundRepeat: 'no-repeat',
        zIndex: 99,
      }}
    >
      <img
        src={Background}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
    </section>
  );
}

export default OrientationPage;