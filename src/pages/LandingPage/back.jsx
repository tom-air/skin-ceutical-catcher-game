import React, { useState, useEffect } from 'react';
import { SquenceAnimator } from 'react-sequence-animator';

const importAll = (r) => r.keys().map((key) => r(key));

const images = importAll(require.context('../../assets/start_btn_ani', true, /.png$/));

console.log('>>>>>', images);
const StartBtn = (props) => {
  const [didMount, setMount] = useState([]);
  const [imagesLoaded, setImgLoad] = useState(0);
  const { onClick } = props;
  const totalImages = images.length;

  useEffect(() => {
    if (imagesLoaded === totalImages) {
      setMount(true)
    }
  }, [imagesLoaded])

  
  const onLoad = () => {
    const loadNum = imagesLoaded + 1;
    setImgLoad(loadNum);
  }
  
  if (!didMount) return null;

  return (
    <div className="start-btn" onClick={onClick}>
      <SquenceAnimator duration={3000}>
        {images.map((img) => (
          <img className="start-btn-img" key={img.default} src={img.default} onLoad={onLoad} />
        ))}
      </SquenceAnimator>
      <p>开始体验</p>
    </div>
  );
};

export default StartBtn;



import React, { useState, useEffect } from 'react';

// const requestImageFile = require.context('../../assets/start_btn_ani', true, /.png$/);

const importAll = (r) => r.keys().map((key) => r(key));

const images = importAll(require.context('../../assets/start_btn_ani', true, /.png$/));

console.log('>>>>>', images);
const StartBtn = (props) => {
  const [didMount, setMount] = useState([]);
  const [imagesLoaded, setImgLoad] = useState(0);
  const { onClick } = props;
  const totalImages = images.length;

  useEffect(() => {
    if (imagesLoaded === totalImages && !imagesLoaded) {
      setMount(true)
    }
  }, [imagesLoaded])

  const onLoad = () => {
    const loadNum = imagesLoaded + 1;
    setImgLoad(loadNum);
  }
  
  if (!didMount) return null;

  return (
    <div className="start-btn" onClick={onClick}>
      {images.map((img) => (
        <img className="start-btn-img" key={img.default} src={img.default} onLoad={onLoad} />
      ))}
      <p>开始体验</p>
    </div>
  );
};

export default StartBtn;