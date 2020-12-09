import html2canvas from 'html2canvas';
import './share.css';

const PrizeCardCom = (cb) => {
  const newImg = document.createElement('img');

  const element = document.getElementById("mock")
  const eleViewPortH = element.getBoundingClientRect().height;
  const eleViewPortW = element.getBoundingClientRect().width;
  if (element) {
    html2canvas(element, {
      allowTaint: false,
      useCORS: true,
      width: eleViewPortW,
      height: eleViewPortH,
      windowHeight: eleViewPortH *  752 / 499,
    }).then(canvas => {
      const container = document.getElementById('prize-card');
      const url = canvas.toDataURL("image/png");
      newImg.src = url;
      newImg.id = 'mockImg';
      element.style.opacity = 0;
      container.appendChild(newImg);
      element.style.opacity = 0;
      cb();
    });
  }
};

export default PrizeCardCom;
