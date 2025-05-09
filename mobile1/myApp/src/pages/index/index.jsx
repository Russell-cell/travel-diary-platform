import React, { useCallback } from "react";
import { View, Text, Button, Image } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import logo from "./hook.png";
import Taro from '@tarojs/taro';

import './index.scss'

const Index = () => {
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

  return (
    <View className="wrapper">
      <Image className="logo" src={logo} />
      <Text className="title">为Taro而设计的Hooks Library</Text>
      <Text className="desc">
        目前覆盖70%官方API. 抹平部分API在H5端短板. 提供近40+Hooks!
        combined with ahook adapter Taro! 更多信息可以查看新版文档: https://next-version-taro-hooks.vercel.app/
      </Text>
      <View className="list">
        <Text className="label">运行环境</Text>
        <Text className="note">{env}</Text>
      </View>
      <Button className="button" onClick={() => setTitle("Taro Hooks Nice!")}>
        设置标题
      </Button>
      <Button className="button" onClick={handleModal}>
        使用Modal
      </Button>
      <Button className="button" onClick={handleNavigate}>
        查看瀑布流组件
      </Button>
      <Button className="button" onClick={handlePublishNavigate}>
        查看游记发布页
      </Button>
    </View>
  );
};

export default Index;