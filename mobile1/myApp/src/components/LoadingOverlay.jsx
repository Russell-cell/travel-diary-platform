import Taro from '@tarojs/taro'
import { View, Text, Loading } from '@tarojs/components'
import './loading-overlay.scss'

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <View className="full-screen-overlay">
      <View className="overlay">
        <Loading size={60} color="#ffffff" />
        <Text className="loading-text">加载中...</Text>
      </View>
    </View>
  )
}

export default LoadingOverlay