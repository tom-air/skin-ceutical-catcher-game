const trackEvent = (category, action, opt_label, opt_value) => {
  const hmt = window._hmt;
  if (hmt) {
    hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
  }
}

const isIOS = () => {
  if (typeof navigator !== 'undefined' && !!navigator.userAgent) {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
  return null;
};

const isWithinWeChat = () => {
  var check = false;
  (function(a){if(/micromessenger/i.test(navigator.userAgent)) 
      check = true;}
  )(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

const isViewInSafari = () => {
  let safariAgent = false;
  if (navigator.userAgent) {
    const userAgent = navigator.userAgent;
    const chromeAgent = userAgent.indexOf.indexOf("Chrome") > -1;
    safariAgent = userAgent.indexOf.indexOf("Safari") > -1;
    if ((chromeAgent) && (safariAgent)) safariAgent = false;
  }
  return safariAgent;
}

export {
  trackEvent,
  isIOS,
  isWithinWeChat,
  isViewInSafari,
}