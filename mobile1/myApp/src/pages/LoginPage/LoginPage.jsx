import Taro from '@tarojs/taro'
import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userSlice'
import { NGROK_URL } from '../../config/ngrok'
import { getToken } from '../../util/tokenRelated'
import FormItem from './components/formItem'
import eyeOpen from '../../../assets/eye-open.png'
import eyeClose from '../../../assets/eye-close.png'
import './LoginPage.scss'

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()

  const handleNavigate = (type) => {
    Taro.navigateTo({
      url: `/pages/${type}/index`
    })
  }

  const handleClear = () => {
    setValue('username', '')
    setValue('password', '')
  }

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(NGROK_URL + '/users/login', data)
      
      Taro.showToast({
        title: res.data.message,
        icon: res.data.message === "登录成功" ? 'success' : 'none',
        duration: 1000
      })

      if(res.data.message === "登录成功") {
        const { _id, avatar, nickname } = res.data.user
        dispatch(setUser({
          id: _id,
          avatar: avatar,
          nickname: nickname
        }))
        Taro.switchTab({ url: '/pages/main/index' })
      }
    } catch (error) {
      Taro.showToast({
        title: '登录失败',
        icon: 'error',
        duration: 1000
      })
    }
  }

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken()
      if (token) {
        try {
          const res = await axios.get(NGROK_URL + '/users/getUserInfo', { 
            headers: { 'token': token } 
          })
          if(res.data._id) {
            Taro.switchTab({ url: '/pages/main/index' })
          }
        } catch (err) {
          console.error('Token验证失败:', err)
        }
      }
    }
    checkToken()
  }, [])

  return (
    <ScrollView 
      className="login-container"
      scrollY
      enableBackToTop
      enableFlex
    >
      <Image 
        src={require('../../../assets/home_background_two.png')}
        mode="aspectFill"
        className="background-image"
      />
      
      <View className="login-section">
        <FormItem
          required
          name="username"
          control={control}
          errors={errors.username}
          rules={{
            required: '不能为空',
            pattern: {
              value: /^[a-zA-Z0-9_-]{4,16}$/,
              message: '用户名格式错误'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onInput={onChange}
              className="login-input"
              placeholder='请输入用户名'
              placeholderClass="placeholder-style"
            />
          )}
        />

        <FormItem
          required
          name="password"
          control={control}
          errors={errors.password}
          rules={{
            required: '不能为空',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
              message: '密码格式错误'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <View className="password-container">
              <Input
                value={value}
                onInput={onChange}
                password={!showPassword}
                className="login-input"
                placeholder='请输入密码'
                placeholderClass="placeholder-style"
              />
              <Image
                src={showPassword ? eyeOpen : eyeClose}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </View>
          )}
        />

        <View className="button-group">
          <View className="login-btn" onClick={handleSubmit(onSubmit)}>
            <Text className="btn-text">登录</Text>
          </View>
          <View className="login-btn reset-btn" onClick={handleClear}>
            <Text className="btn-text">重置</Text>
          </View>
        </View>

        <View className="sub-buttons">
          <Text className="link-text" onClick={() => handleNavigate('register')}>
            新用户注册
          </Text>
          <Text className="link-text" onClick={() => Taro.switchTab({ url: '/pages/main/index' })}>
            游客访问
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}