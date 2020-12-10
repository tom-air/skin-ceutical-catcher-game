import React, { useCallback, useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import { trackEvent } from '../../UtilHelpers';

const CopyToShare = (props) => {
  const { msgToCopy, children, target } = props;
  const alert = useAlert();
  const [child, setChild] = useState(children);
  const [showAlert, setAlert] = useState('');

  const Success = <div id="copy-hashtag">复制成功</div>;

  const showSuccess = () => {
    if (target) {
      const targetToModify = document.getElementById(target);
      targetToModify.innerHTML = '复制成功';
      setTimeout(() => {
        targetToModify.innerHTML = 'https://skinceuticalstrasia.cn/';
        setAlert('');
      }, 5000);
    } else {
      setChild(Success);
      setTimeout(() => {
        setChild(children);
        setAlert('');
      }, 5000);
    }
  }

  useEffect(() => {
    if (showAlert) {
      showSuccess();
    }
  }, [showAlert, children])

  const isIOS = useCallback(() => {
    if (typeof navigator !== 'undefined' && !!navigator.userAgent) {
      return navigator.userAgent.match(/ipad|iphone/i);
    }
    return null;
  }, [navigator]);

  const selectText = (textArea) => {
    const isIos = isIOS();
    if (isIos) {
      const inputField = textArea;
      const editable = textArea.contentEditable;
      const isReadOnly = textArea.readOnly;

      inputField.contentEditable = true;
      inputField.readOnly = true;

      const range = document.createRange();
      range.selectNodeContents(inputField);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      inputField.setSelectionRange(0, 999999);
      inputField.contentEditable = editable;
      inputField.readOnly = isReadOnly;
    } else {
      textArea.select();
    }
  };

  const copyToClipBoard = () => {
    // Create textArea
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.value = msgToCopy;
      document.body.appendChild(textArea);
      // Select Text
      selectText(textArea);
      try {
        // Copy text
        document.execCommand('copy');
        document.body.removeChild(textArea);
        trackEvent('button', 'click', 'copy-hashtag');
        setAlert('複製成功')
      } catch (err) {
        alert.error('未能複製，請稍候再嘗試。')
      }
    }
  };

  return (
    children && msgToCopy && typeof document !== 'undefined'
      && !!document.queryCommandSupported && document.queryCommandSupported('copy') && (
        <div onClick={copyToClipBoard}>
          {child}
        </div>
    )
  );
};

export default CopyToShare;