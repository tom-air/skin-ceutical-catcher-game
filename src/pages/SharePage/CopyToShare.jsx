import React, { useCallback, useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import ClipboardJS from 'clipboard';
import { trackEvent } from '../../UtilHelpers';

const CopyToShare = (props) => {
  const { msgToCopy, children, target } = props;
  const alert = useAlert();
  let clipboard;

  const unmountPage = () => {
    clipboard.destroy();
  }

  const showSuccess = () => {
    if (target) {
      const targetToModify = document.getElementById(target);
      targetToModify.innerHTML = '复制成功';
      setTimeout(() => {
        targetToModify.innerHTML = 'https://skinceuticalstrasia.cn/';
      }, 5000);
    }
  }

  useEffect(() => {
    clipboard = new ClipboardJS('#copy-to-share', {
      text: () => msgToCopy,
    });
    clipboard.on('success', () => {
      trackEvent('button', 'copy-btn', msgToCopy);
      showSuccess();
    });
  
    clipboard.on('error', () => alert.error('未能复制，请稍候再尝试'));
    return unmountPage;
  }, [])

  return (
    <div id="copy-to-share">
      {children}
    </div>
  );
};

export default CopyToShare;