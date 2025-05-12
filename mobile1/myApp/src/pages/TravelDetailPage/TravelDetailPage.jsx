
import Taro, { useDidShow, useRouter, useState, useEffect } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtMessage } from 'taro-ui'
import { useDispatch, useSelector } from '@tarojs/redux'
import moment from 'moment'
import axios from 'axios'
import { NGROK_URL } from '../../config/ngrok'
import LoadingOverlay from '../../components/LoadingOverlay.jsx'
import { getToken } from '../../util/tokenRelated'
import { setUser } from '../../redux/userSlice'
import MyDialog from '../../components/myDialog'

import './TravelDetailPage.scss'

const DetailScreen = () => {
  const dispatch = useDispatch()
  const { params } = useRouter()
  const [travelDetail, setTravelDetail] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const userInfo = useSelector(state => state.user)
  const [liked, setLiked] = useState(userInfo.likeTravels.includes(params.cardId))
  const [collected, setCollected] = useState(userInfo.collectTravels.includes(params.cardId))
  const [isLoading, setIsLoading] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [visible, setVisible] = useState(false)

  // 数据加载
  useEffect(() => {
    Taro.showLoading({ title: '加载中' })
    axios.get(`${NGROK_URL}/travels/getDetails`, {
      params: { id: params.cardId }
    }).then(res => {
      const detail = processData(res.data.travelDetail)
      setTravelDetail(detail)
      setNavigation(detail)
      Taro.hideLoading()
    })
  }, [])

  const processData = (data) => {
    return {
      ...data,
      formattedDateString: moment(data.createTime).format('发布于YYYY-MM-DD'),
      photo: data.photo.map(item => ({ url: item.uri || item.url }))
    }
  }

  // 导航栏配置
  const setNavigation = (detail) => {
    Taro.setNavigationBarLeftButton({
      text: '',
      iconPath: detail.userInfo.avatar,
      success: () => {
        Taro.setNavigationBarTitle({
          title: detail.userInfo.nickname
        })
      }
    })
  }

  // 图片预览
  const handleImagePreview = (urls, index) => {
    Taro.previewImage({
      current: urls[index].url,
      urls: urls.map(item => item.url)
    })
  }

  // 分享功能
  const handleShare = () => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.showShareMenu({ withShareTicket: true })
    } else {
      Taro.share({
        title: `${userInfo.nickname}的游记分享`,
        path: `/pages/detail/index?id=${params.cardId}`,
        imageUrl: travelDetail.photo[0].url
      })
    }
  }

  // 收藏逻辑
  const handleCollect = async () => {
    if (!userInfo.id) {
      Taro.atMessage({
        message: '您还没有登录哦~',
        type: 'error',
        duration: 1000
      })
      return
    }

    if (isRequesting) return
    setIsRequesting(true)

    try {
      const token = await getToken()
      if (!collected) {
        const res = await axios.post(`${NGROK_URL}/travels/collectTravel`, 
          { travelId: params.cardId },
          { headers: { 'token': token } }
        )
        if (res.data.message === '收藏成功') {
          setCollected(true)
          setTravelDetail(prev => ({
            ...prev,
            collectedCount: prev.collectedCount + 1
          }))
          dispatch(setUser({
            ...userInfo,
            collectTravels: [...userInfo.collectTravels, params.cardId]
          }))
        }
      } else {
        setVisible(true)
      }
    } finally {
      setIsRequesting(false)
    }
  }

  // 点赞逻辑
  const handleLike = async () => {
    if (!userInfo.id) {
      Taro.atMessage({
        message: '您还没有登录哦~',
        type: 'error',
        duration: 1000
      })
      return
    }

    if (isRequesting) return
    setIsRequesting(true)

    try {
      const token = await getToken()
      const endpoint = liked ? 'UndoLikeTravel' : 'likeTravel'
      const res = await axios.post(`${NGROK_URL}/travels/${endpoint}`, 
        { travelId: params.cardId },
        { headers: { 'token': token } }
      )

      if (res.data.message.includes('成功')) {
        setLiked(!liked)
        setTravelDetail(prev => ({
          ...prev,
          likedCount: liked ? prev.likedCount - 1 : prev.likedCount + 1
        }))
        dispatch(setUser({
          ...userInfo,
          likeTravels: liked ? 
            userInfo.likeTravels.filter(id => id !== params.cardId) :
            [...userInfo.likeTravels, params.cardId]
        }))
      }
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <View className='detail-container'>
      <AtMessage />
      
      <ScrollView scrollY className='content-scroll'>
        {/* 图片轮播区 */}
        <View className='swiper-container'>
          <Swiper
            current={currentIndex}
            onChange={e => setCurrentIndex(e.detail.current)}
            className='image-swiper'
          >
            {travelDetail?.photo.map((item, index) => (
              <SwiperItem key={index}>
                <Image 
                  src={item.url} 
                  mode='aspectFill'
                  className='swiper-image'
                  onClick={() => handleImagePreview(travelDetail.photo, index)}
                />
              </SwiperItem>
            ))}
          </Swiper>
          <View className='pagination'>
            {currentIndex + 1}/{travelDetail?.photo.length}
          </View>
        </View>

        {/* 内容区 */}
        <View className='content-section'>
          {/* 位置标签 */}
          <View className='location-tags'>
            {['country', 'province', 'city'].map(key => (
              travelDetail?.location?.[key] && (
                <View key={key} className='location-item'>
                  <AtIcon prefixClass='icon' value='map-pin' size={12} color='#fff' />
                  <Text>{travelDetail.location[key]}</Text>
                </View>
              )
            ))}
          </View>

          {/* 标题和内容 */}
          <Text className='title'>{travelDetail?.title}</Text>
          <Text className='content'>{travelDetail?.content}</Text>
          <Text className='time'>{travelDetail?.formattedDateString}</Text>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className='action-bar safe-area-bottom'>
        <View className='action-item' onClick={handleLike}>
          <AtIcon 
            value='heart' 
            size={24} 
            color={liked ? '#FF4444' : '#333'} 
          />
          <Text>{travelDetail?.likedCount || 0}</Text>
        </View>

        <Button className='action-item' openType='share'>
          <AtIcon value='share' size={24} />
          <Text>分享</Text>
        </Button>

        <View className='action-item' onClick={handleCollect}>
          <AtIcon
            value='star'
            size={24}
            color={collected ? '#FFC107' : '#333'}
          />
          <Text>{travelDetail?.collectedCount || 0}</Text>
        </View>
      </View>

      {/* 自定义对话框 */}
      <MyDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={() => {
          // 取消收藏逻辑
          setVisible(false)
          setCollected(false)
          setTravelDetail(prev => ({
            ...prev,
            collectedCount: prev.collectedCount - 1
          }))
          dispatch(setUser({
            ...userInfo,
            collectTravels: userInfo.collectTravels.filter(id => id !== params.cardId)
          }))
        }}
      />

      {/* 加载状态 */}
      <LoadingOverlay isVisible={isLoading} />
    </View>
  )
}

export default DetailScreen