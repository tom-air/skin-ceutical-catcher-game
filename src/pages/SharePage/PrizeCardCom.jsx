import React, { useRef, useEffect, forwardRef, useState } from 'react';
import html2canvas from 'html2canvas';

import BrandLogo from '../../assets/Logo_white.png';
import './share.css';
import prizeCard from '../../assets/prize_card.png';
import prizeCardQRcode from '../../assets/prize_card_qr_code.png';
import skinCBottle from '../../assets/skin_c_bottle.png';
import goldElementBg from '../../assets/prize_gold_element_bg.png';
import prizeCardOutline from '../../assets/prize_card_outline.png';

const PrizeCardCom = forwardRef((props, ref) => {
  const cardRef = useRef();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    drawImage();
  }, [])

  useEffect(() => {
    if (mount) {
      drawImage(mount)
    }
  }, [mount])
  
  const drawImage = (isMounted) => {
    const prizeCard = cardRef.current;

    const element = document.getElementById("mock")
    const eleViewPortH = element.getBoundingClientRect().height;
    const eleViewPortW = element.getBoundingClientRect().width;
    if (prizeCard) {
      html2canvas(prizeCard, {
        allowTaint: false,
        useCORS: true,
        width: eleViewPortW,
        height: eleViewPortH,
        windowHeight: eleViewPortH *  752 / 466 ,
      }).then(canvas => {
        if (isMounted) {
          const container = document.getElementById('prize-card')
          canvas.toBlob(function(blob) {
            const newImg = document.createElement('img'),
                url = URL.createObjectURL(blob);
          
            newImg.onload = function() {
              URL.revokeObjectURL(url);
            };
          
            newImg.src = url;
            newImg.id = 'mockImg';
            element.style.opacity = 0;
            container.appendChild(newImg);
            prizeCard.style.opacity = 0;
          });
        }
        setMount(true);
      });
    }
  }
  
  return (
    <div
      className="prize-card"
      id='prize-card'
    >
      <div id="mock" ref={cardRef}>
        <img
          className="brand-logo"
          src={BrandLogo}
        />
        <div className="main-text">修丽可抗氧魔镜</div>
        <img id="prize-card-bg" src={prizeCard} />
        <img id="prize-card-gold-element-bg" src={goldElementBg} />
        <div id="selfie-filter">
          <div className="selfie-filter-bg"></div>
          <img id="selfie-preview" src={window.selfieURI} />
        </div>
        <div id="img-group">
          <img id="skin-c-bottle" src={skinCBottle} />
          <div id="hash-text">
            <p>#修丽可</p>
            <p>#抗氧修护</p>
          </div>
          <img id="prize-card-qr-code" src={prizeCardQRcode} />
        </div>
      </div>
      <img src={prizeCardOutline} id="card-outline" />
    </div>
  );
});

export default PrizeCardCom;
