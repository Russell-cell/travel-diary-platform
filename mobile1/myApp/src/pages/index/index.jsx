import React, { useCallback, useState } from "react";
import { View, Text, Input } from "@tarojs/components";
import { useNavigationBar, useToast } from "taro-hooks";
import Taro from '@tarojs/taro';
import WaterfallPage from '../WaterfallPage/WaterfallPage';

import './index.scss'

const Index = () => {
  const [searchKey, setSearchKey] = useState('');
  const [currentTab, setCurrentTab] = useState('home');
  const { setTitle } = useNavigationBar({ title: "旅行日记平台" });
  const { showToast } = useToast({ mask: true, duration: 1500 });

  const handleNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/WaterfallPage/WaterfallPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      showToast({ title: '页面跳转失败' });
    });
  }, [showToast]);

  const handlePublishNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/TravelPublishPage/TravelPublishPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      showToast({ title: '页面跳转失败' });
    });
  }, [showToast]);

  // 删除未使用的handleDetailNavigate
  const handleDetailNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/TravelDetailPage/TravelDetailPage'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      showToast({ title: '页面跳转失败' });
    });
  }, [showToast]);

  // 删除未使用的handleMyTravelListNavigate
  const handleMyTravelListNavigate = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/MyTravelList/MyTravelList'
    }).catch((error) => {
      console.error('页面跳转失败:', error);
      showToast({ title: '页面跳转失败' });
    });
  }, [showToast]);

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
            // 移除冗余的switchTab调用
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