import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image, Picker } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux'
import { useForm } from 'react-hook-form'
import { AtInput, AtTextarea, AtMessage } from 'taro-ui'
import FormItem from './components/formItem'
import LoadingOverlay from '../../components/LoadingOverlay'
import axios from 'axios'
import { NGROK_URL } from '../../config/ngrok'
import './editUserInfo.scss'

const EditUserInfoScreen = () => {
  const [height, setHeight] = useState(80)
  const [selected, setSelected] = useState('未选')
  const [image, setImage] = useState(null)
  const [file, setFile] = useState({ file: null })
  const [isLoading, setIsLoading] = useState(false)
  const userInfo = useSelector(state => state.user)
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickname: userInfo.nickname,
      introduction: userInfo.introduction || ' '
    },
  })

  const pickImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album']
      })
      
      if (res.tempFilePaths.length > 0) {
        const uri = res.tempFilePaths[0]
        const name = uri.split('/').pop()
        setImage(uri)
        setFile({
          file: {
            uri,
            name,
            type: 'image/jpeg',
          }
        })
      }
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  useEffect(() => {
    setSelected(userInfo.gender || '未选')
  }, [userInfo.gender])

  const onSubmit = async (data) => {
    setIsLoading(true)
    const params = new FormData()
    
    if (file.file) {
      params.append('file', file.file)
    }
    
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value)
    })
    
    params.append("gender", selected)
    params.append("id", userInfo.id)
    params.append("avatar", userInfo.avatar)

    try {
      const res = await axios.post(`${NGROK_URL}/users/update`, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      Taro.atMessage({
        message: res.data.message,
        type: 'success'
      })
      
      dispatch(setUser({
        ...userInfo,
        avatar: file.file ? file.file.uri : userInfo.avatar,
        nickname: data.nickname,
        gender: selected,
        introduction: data.introduction,
      }))
      
      Taro.navigateBack()
    } catch (err) {
      console.error(err)
      Taro.atMessage({
        message: '更新失败',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView scrollY className="edit-container">
      <AtMessage />
      <LoadingOverlay isVisible={isLoading} />
      
      <View className="card-container">
        <View className="avatar-container">
          <Image
            src={image || userInfo.avatar}
            className="avatar-image"
            onClick={pickImage}
          />
        </View>

        <View className="form-container">
          {/* 昵称输入 */}
          <FormItem
            name="nickname"
            control={control}
            required
            error={errors.nickname}
            rules={{ required: '昵称不能为空' }}
          >
            <AtInput
              name="nickname"
              title="昵称:"
              placeholder="请输入您的昵称"
              border={false}
              className="nickname-input"
            />
          </FormItem>

          {/* 性别选择 */}
          <View className="gender-picker">
            <Text className="picker-label">性别:</Text>
            <Picker
              mode="selector"
              range={['未选', '男', '女']}
              value={selected}
              onChange={e => setSelected(e.detail.value)}
            >
              <View className="picker-value">{selected}</View>
            </Picker>
          </View>

          {/* 简介输入 */}
          <FormItem
            name="introduction"
            control={control}
            error={errors.introduction}
          >
            <AtTextarea
              value={control._formValues.introduction}
              onChange={value => control.setValue('introduction', value)}
              placeholder="请输入您的简介"
              height={height}
              className="introduction-textarea"
            />
          </FormItem>

          {/* 提交按钮 */}
          <View className="submit-button" onClick={handleSubmit(onSubmit)}>
            <Text className="button-text">提交修改</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default EditUserInfoScreen