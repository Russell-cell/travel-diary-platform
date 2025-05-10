import React, { useCallback, useState } from "react";
import { View, Text, Button, Image, Input } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import logo from "./hook.png";
import Taro from '@tarojs/taro';
import WaterfallPage from '../WaterfallPage/WaterfallPage';

import './index.scss'

const Index = () => {
  const [searchKey, setSearchKey] = useState('');
  const [currentTab, setCurrentTab] = useState('home');
  const env = useEnv();
  const { setTitle } = useNavigationBar({ title: "Taro Hooks" });
  const showModal = useModal({
    title: "Taro Hooks Canary!",
    showCancel: false,
    confirmColor: "#8c2de9",
    confirmText: "支持一下"
  });
  const { show } = useToast({ mask: true });

  const handleModal = useCallback(() => {
    showModal({ content: "不如给一个star⭐️!" }).then(() => {
      show({ title: "点击了支持!" });
    });
  }, [show, showModal]);

  const handleNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/WaterfallPage/WaterfallPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      show({ title: '页面跳转失败' });
    });
  }, [show]);

  const handlePublishNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/TravelPublishPage/TravelPublishPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      show({ title: '页面跳转失败' });
    });
  }, [show]);

  const handleDetailNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/TravelDetailPage/TravelDetailPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      show({ title: '页面跳转失败' });
    });
  }, [show]);

  const handleMyTravelListNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/MyTravelList/MyTravelList'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      show({ title: '页面跳转失败' });
    });
  }, [show]);

  return (
    <View className="wrapper">
      {/* 搜索栏 */}
      <View className="search-bar">
        <Input
          placeholder="搜索游记..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.detail.value)}
        />
      </View>
      {/* 瀑布流内容 */}
      <View className="waterfall-content">
        {/* 假设WaterfallPage组件已实现，此处引入 */}
        <WaterfallPage searchKey={searchKey} />
      </View>
      {/* 底部导航栏 */}
      <View className="tab-bar">
        <View
          className={`tab-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('home');
            Taro.navigateTo({ url: '/pages/index/index' });
          }}
        >
          <Text>主界面</Text>
        </View>
        <View
          className={`tab-item ${currentTab === 'publish' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('publish');
            Taro.navigateTo({ url: '/pages/TravelPublishPage/TravelPublishPage' });
          }}
        >
          <Text>发布日志</Text>
        </View>
        <View
          className={`tab-item ${currentTab === 'my' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('my');
            Taro.navigateTo({ url: '/pages/MyTravelList/MyTravelList' });
          }}
        >
          <Text>我的游记</Text>
        </View>
      </View>
    </View>
  );
};

export default Index;