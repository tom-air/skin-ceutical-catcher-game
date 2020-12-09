import React from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import StartBtnAni from '../../assets/start_btn_ani.png';

const AnimateBtn = (props) => {
  const { className, title, onClick, onImgLoad } = props;

  return (
    <div className={className} onClick={onClick}>
      {/* <img className="start-btn-img" src={BtnAni} /> */}
      <Spritesheet
        className="start-btn-img"
        image={StartBtnAni}
        widthFrame={402}
        heightFrame={122}
        steps={60}
        fps={45}
        onPlay={onImgLoad}
        autoplay
        loop
        isResponsive
      />
      <p>{title}</p>
    </div>
  );
};

AnimateBtn.defaultProps = {
  className: 'start-btn',
}

export default AnimateBtn;