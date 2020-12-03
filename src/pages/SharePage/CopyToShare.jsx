import React, { useCallback, useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

const CopyToShare = (props) => {
  const { msgToCopy, children } = props;
  const alert = useAlert();
  const [showAlert, setAlert] = useState('');

  useEffect(() => {
    if (showAlert) {
      alert.success(showAlert, {
        onClose: () => {
          setAlert('')
        }
      })
    }
  }, [showAlert])

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
          {children}
        </div>
    )
  );
};

export default CopyToShare;