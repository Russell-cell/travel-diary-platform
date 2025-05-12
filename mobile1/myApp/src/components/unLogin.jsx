import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './unlogin.scss'

const UnLoginScreen = () => {
  const handleNavigate = (type) => {
    Taro.navigateTo({
      url: `/pages/${type}/index`
    })
  }

  return (
    <View className="unlogin-container">
      <View className="card-wrapper">
        <View className="card-content">
          <Text className="title">您还没登录</Text>
          <Text className="subtitle">请先登录或注册再进行此操作</Text>
          
          <View className="button-group">
            <Button 
              className="login-btn" 
              onClick={() => handleNavigate('login')}
            >
              立即登录
            </Button>
            
            <Text 
              className="register-tip" 
              onClick={() => handleNavigate('register')}
            >
              还未注册?
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default UnLoginScreen