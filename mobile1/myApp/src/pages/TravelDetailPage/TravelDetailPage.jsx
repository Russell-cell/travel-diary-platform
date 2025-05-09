import React, { useState, useEffect } from "react";
import { View, Text, Image, Swiper, SwiperItem, Video, Button } from "@tarojs/components";
import Taro from '@tarojs/taro';
import './TravelDetailPage.scss';

const TravelDetailPage = ({ $router }) => {
  const [travelData, setTravelData] = useState({});
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const { id } = $router.params;
    // 模拟获取游记详情数据，实际应替换为接口请求
    const mockData = {
      author: { name: '旅行达人', avatar: 'https://via.placeholder.com/50x50.png?text=Avatar' },
      content: '这是一篇精彩的游记，记录了旅途中的美好瞬间...',
      video: 'https://example.com/travel-video.mp4',
      images: ['https://via.placeholder.com/600x400.png?text=Image1', 'https://via.placeholder.com/600x400.png?text=Image2']
    };
    setTravelData(mockData);
    mockData.video && setMediaList([{ type: 'video', url: mockData.video }, ...mockData.images.map(url => ({ type: 'image', url }))]);
  }, [$router.params]);

  const handleVideoPlay = () => {
    Taro.navigateTo({ url: `/pages/VideoPlayerPage/VideoPlayerPage?url=${encodeURIComponent(travelData.video)}` });
  };

  return (
    <View className="detail-container">
      {/* 作者信息 */}
      <View className="author-info">
        <Image className="avatar" src={travelData.author?.avatar} />
        <Text className="author-name">{travelData.author?.name}</Text>
      </View>

      {/* 内容正文 */}
      <Text className="content">{travelData.content}</Text>

      {/* 媒体展示 */}
      {mediaList.length > 0 && (
        <View className="media-container">
          <Swiper className="media-swiper" indicatorDots circular>
            {mediaList.map((item, index) => (
              <SwiperItem key={index} className="swiper-item">
                {item.type === 'video' ? (
                  <Video
                    className="video" 
                    src={item.url}
                    controls
                    onClick={handleVideoPlay}
                  />
                ) : (
                  <Image
                    className="image" 
                    src={item.url}
                    mode="widthFix"
                    onClick={() => Taro.previewImage({ urls: mediaList.filter(m => m.type === 'image').map(m => m.url), current: item.url })}
                  />
                )}
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      )}

      {/* 分享按钮 */}
      <Button className="share-btn" openType="share">分享游记</Button>
    </View>
  );
};

// 分享配置
TravelDetailPage.config = {
  navigationBarTitleText: '游记详情',
  enableShareAppMessage: true
};

// 分享逻辑
TravelDetailPage.prototype.onShareAppMessage = function() {
  return {
    title: `${travelData.author?.name}的游记`,
    path: `/pages/TravelDetailPage/TravelDetailPage?id=${$router.params.id}`,
    imageUrl: travelData.images?.[0]
  };
};

export default TravelDetailPage;