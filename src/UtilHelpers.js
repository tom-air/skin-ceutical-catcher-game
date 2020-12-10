const findKey = require('lodash/findKey');

const config = {
  assetsUrl: 'https://skinc-cny.oss-cn-shenzhen.aliyuncs.com/assets',
};

const trackEvent = (category, action, opt_label, opt_value) => {
  const hmt = window._hmt;
  if (hmt) {
    hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
  }
}

const getDeviceOS = (ua) => {
  const OS = {
    android: [/Android/],
    ios: [/\biPhone.*Mobile|\biPod|\biPad/],
    blackberry: [/blackberry|\bBB10\b|rim tablet os/],
    palm: [/PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino/],
    symbian: [/Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\bS60\b/],
    windows: [
      /Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;/,
      /Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;/,
    ],
  };

  return findKey(OS, regexs => findKey(regexs, regex => regex.test(ua))) || 'other';
}

export {
  config,
  trackEvent,
  getDeviceOS,
}