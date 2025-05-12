import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './myDialog.scss';

const MyDialog = ({ visible, onDismiss, titleText, dialogText, cancelText, confirmText, handleCancel, handleConfirm }) => {
  if (!visible) return null;

  const handleMaskClick = (e) => {
    e.stopPropagation();
    onDismiss && onDismiss();
  };

  return (
    <View className="dialog-mask" onClick={handleMaskClick}>
      <View className="dialog-container">
        <Text className="dialog-title">{titleText}</Text>
        <Text className="dialog-content">{dialogText}</Text>
        <View className="dialog-actions">
          <Button className="dialog-cancel" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button className="dialog-confirm" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </View>
      </View>
    </View>
  );
};

MyDialog.defaultProps = {
  cancelText: '取消',
  confirmText: '确认',
  dialogText: '您确定要取消吗？'
};

export default MyDialog;