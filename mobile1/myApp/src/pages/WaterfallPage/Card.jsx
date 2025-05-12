import React, { useState, useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import MyDialog from '../../myDialog';
import { setUser } from '../../redux/userSlice';
import { getToken } from '../../util/tokenRelated';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const FadeImage = (props) => {
  const _animatedValue = useRef(new Taro.Animated.Value(0)).current;
  const { style, onLoadEnd } = props;
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    return <Image {...props} />;
  }
  return (
    <Taro.Animated.Image
      {...props}
      onLoadEnd={() => {
        Taro.Animated.timing(_animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onLoadEnd && onLoadEnd();
      }}
      style={[style, { opacity: _animatedValue }]}
    />
  );
};

const Card = ({ item }) => {
  const styles = StyleSheet.create({
    aboveAll: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: 10
    }
  });
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user);
  const [visible, setVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [collectedCount, setCollectedCount] = useState(0);
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    setCollectedCount(item.collectedCount);
    setCollected(userInfo.collectTravels ? userInfo.collectTravels.includes(item._id) : false);
  }, [userInfo.collectTravels, item._id]);

  useEffect(() => {
    setCollectedCount(item.collectedCount);
  }, [item.collectedCount]);

  const onPressCard = () => Taro.navigateTo({ url: `/pages/TravelDetailPage/TravelDetailPage?id=${item._id}` });
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleCollect = async (cardId) => {
    if (!userInfo.id) {
      Toast.show({ type: 'error', text1: '您还没有登录哦~', position: 'top' });
      return;
    }
    if (isRequesting) return;
    setIsRequesting(true);
    try {
      const token = await getToken();
      if (!token) return;
      if (!collected) {
        const response = await axios.post(`${NGROK_URL}/travels/collectTravel`, { travelId: cardId }, { headers: { 'token': token } });
        if (response.data.message === '收藏成功') {
          setCollected(true);
          dispatch(setUser({ ...userInfo, collectTravels: [...userInfo.collectTravels, cardId] }));
          setCollectedCount(collectedCount + 1);
        }
      } else {
        showDialog();
      }
    } catch (error) {
      console.error('收藏请求失败:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const cancelCollected = async (cardId) => {
    setIsRequesting(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${NGROK_URL}/travels/UndoCollectTravel`, { travelId: cardId }, { headers: { 'token': token } });
      if (response.data.message === '取消收藏成功') {
        setCollected(false);
        dispatch(setUser({ ...userInfo, collectTravels: userInfo.collectTravels.filter(id => id !== cardId) }));
        setCollectedCount(collectedCount - 1);
      }
      hideDialog();
    } catch (error) {
      console.error('取消收藏请求失败:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View className="travel-card" style={styles.aboveAll}>
      <MyDialog
        visible={visible}
        onDismiss={hideDialog}
        titleText="取消收藏"
        dialogText="您确定不再收藏这篇游记吗？"
        cancelText="取消"
        confirmText="确认"
        handleCancel={hideDialog}
        handleConfirm={() => cancelCollected(item._id)}
      />
      <View style={{ backgroundColor: '#fff', flex: 1 }} onClick={onPressCard} className="card-image-container" activeOpacity="0.5">
        <FadeImage
          source={{ uri: item.uri }}
          style={{ width: '100%', height: item.height }}
          resizeMode="cover"
        />
      </View>
      <View className="card-content">
        <Text className="card-title">{item.title}</Text>
        <View className="author-info">
          <Image source={{ uri: item.avatar }} style={{ width: 20, height: 20, borderRadius: 10 }} />
          <Text className="author-name">{item.nickname}</Text>
        </View>
        <View className="interact-buttons">
          <Button type="default" size="small" onClick={() => handleCollect(item._id)}>
            {collected ? <AntDesign name="heart" size={16} color="red" /> : <AntDesign name="hearto" size={16} color="#333" />}
            <Text>{collectedCount}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Card;