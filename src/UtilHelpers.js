const trackEvent = (category, action, opt_label, opt_value) => {
  const hmt = window._hmt;
  if (hmt) {
    console.log('>>>on track', category, action, opt_label)
    hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
  }
}

export {
  trackEvent,
}