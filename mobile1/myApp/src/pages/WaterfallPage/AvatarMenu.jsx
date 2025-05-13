import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Button, Modal } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import { removeToken } from '../../utils/tokenRelated';
import './AvatarMenu.scss';

const AvatarMenu = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);

  const onLogout = () => {
    removeToken();
    dispatch(clearUser());
    Taro.navigateTo({ url: '/pages/LoginPage/LoginPage' });
    setVisible(false);
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View className="avatar-menu">
      <Button className="avatar-btn" onClick={openMenu}>
        <Image
          src={userInfo.avatar ? { uri: userInfo.avatar } : { uri: 'https://5b0988e595225.cdn.sohucs.com/images/20171114/bc48840fb6904dd4bd8f6a8af8178af4.png' }}
          style={{ width: '36px', height: '36px', borderRadius: '18px' }}
        />
      </Button>
      <Modal
        visible={visible}
        onCancel={closeMenu}
        transparent
        title="操作菜单"
      >
        <View className="modal-content">
          {userInfo.id ? (
            <> 
              <Button className="menu-item" onClick={() => {
                Taro.navigateTo({ url: '/pages/TravelPublishPage/TravelPublishPage' });
                closeMenu();
              }}>
                写游记
              </Button>
              <Button className="menu-item" onClick={() => {
                Taro.navigateTo({ url: '/pages/MyTravelsPage/MyTravelsPage' });
                closeMenu();
              }}>
                我的游记
              </Button>
              <Button className="menu-item" onClick={onLogout}>
                退出登录
              </Button>
            </>
          ) : (
            <Button className="menu-item" onClick={() => {
              Taro.navigateTo({ url: '/pages/LoginPage/LoginPage' });
              closeMenu();
            }}>
              登录
            </Button>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default AvatarMenu;