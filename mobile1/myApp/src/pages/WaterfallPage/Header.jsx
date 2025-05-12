import React from 'react';
import Taro from '@tarojs/taro';
import { View, Input, Button } from '@tarojs/components';
import './Header.scss';
import AvatarMenu from './AvatarMenu';

// 顶部组件；包括头像菜单，搜索框
const Header = ({ searchText, setSearchText, handleSearch }) => {
  return (
    <View className="header-aboveAll">
      <View className="header-avatarMenu">
        {/* 头像菜单 */}
        <AvatarMenu></AvatarMenu >
      </View>
      <View className="header-searchBar">
        <Input
          className="header-textInput"
          placeholder="请输入您要搜索的内容"
          value={searchText}
          onChange={(e) => setSearchText(e.detail.value)}
        />
      </View>
      <View className="header-buttonContainer">
        <Button
          className="header-button"
          onClick={handleSearch}
        >
          搜索
        </Button>
      </View>
    </View>
  );
};

export default Header;