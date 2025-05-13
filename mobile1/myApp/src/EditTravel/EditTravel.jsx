import Taro, { useDidShow, useRouter, useState, useEffect } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Picker } from '@tarojs/components'
import { AtInput, AtButton, AtMessage, AtIcon, AtCard } from 'taro-ui'
import { useForm } from 'react-hook-form'
import { useSelector } from '@tarojs/redux'
import axios from 'axios'
import { NGROK_URL } from '../../config/ngrok'
import FormItem from '../../components/formItem'
import LoadingOverlay from '../components/LoadingOverlay'
import placeList from '../Page/TravelPublishPage/placeList'
import './EditTravel.scss'

const EditTravelScreen = () => {
  const { params } = useRouter()
  const [image, setImage] = useState([])
  const [file, setFile] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [fold, setFold] = useState(true)
  const [selectedValues, setSelectedValues] = useState(['', '', ''])
  const [filteredProvinces, setFilteredProvinces] = useState([])
  const [filteredCities, setFilteredCities] = useState([])
  const [photo, setPhoto] = useState([])
  const userInfo = useSelector(state => state.user)
  const [contentHeight, setContentHeight] = useState(200)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: params?.title || '',
      content: params?.content || ''
    }
  })

  useDidShow(() => {
    initParams()
  })

  const initParams = () => {
    if (params) {
      const photoUriArray = params.photo?.map(p => p.uri) || []
      setImage(photoUriArray)
      setPhoto(params.photo || [])

      if (params.location?.country !== "undefined") {
        handleLocationInit(params.location)
      }
    }
  }

  const handleLocationInit = (location) => {
    setSelectedValues([
      location.country || '',
      location.province || '',
      location.city || ''
    ])
    
    const country = placeList.find(c => c.name === location.country)
    if (country) {
      setFilteredProvinces(country.provinces)
      const province = country.provinces.find(p => p.name === location.province)
      if (province) setFilteredCities(province.cities)
    }
  }

  const handleCountryChange = (value) => {
    setSelectedValues([value, '', ''])
    const country = placeList.find(c => c.name === value)
    setFilteredProvinces(country?.provinces || [])
    setFilteredCities([])
  }

  const handleProvinceChange = (value) => {
    setSelectedValues([selectedValues[0], value, ''])
    const province = filteredProvinces.find(p => p.name === value)
    setFilteredCities(province?.cities || [])
  }

  const pickImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album']
      })
      
      const newFiles = res.tempFilePaths.map(uri => ({
        uri,
        name: uri.split('/').pop(),
        type: 'image/jpeg'
      }))

      setImage(prev => [...prev, ...res.tempFilePaths])
      setFile(prev => [...prev, ...newFiles])
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  const deletePhoto = (uri) => {
    const newImages = image.filter(item => item !== uri)
    const httpCount = image.filter(item => item.startsWith('http')).length
    const index = image.indexOf(uri)

    setImage(newImages)
    if (index >= httpCount) {
      setFile(prev => prev.filter((_, i) => i !== (index - httpCount)))
    } else {
      setPhoto(prev => prev.filter((_, i) => i !== index))
    }
  }

  const onSubmit = async (data) => {
    if (!file.length && !photo.length) {
      Taro.atMessage({ message: '请至少上传一张图片', type: 'error' })
      return
    }

    setIsLoading(true)
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => formData.append(key, value))
    file.forEach(item => formData.append('file', item))
    formData.append('location', JSON.stringify({
      country: selectedValues[0],
      province: selectedValues[1],
      city: selectedValues[2]
    }))
    formData.append('travelState', "2")
    formData.append('id', params.id)
    formData.append('photo', JSON.stringify({ photodata: photo }))

    try {
      const res = await axios.post(`${NGROK_URL}/travels/updateOneTravel`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'token': await getToken()
        }
      })
      
      Taro.atMessage({ message: res.data.message, type: 'success' })
      Taro.navigateBack()
    } catch (error) {
      console.error('提交失败:', error)
      Taro.atMessage({ message: '提交失败，请重试', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="edit-container">
      <AtMessage />
      <LoadingOverlay isVisible={isLoading} />
      
      <ScrollView scrollY className="scroll-view">
        <View className="image-container">
          <ScrollView scrollX className="horizontal-scroll">
            {image.map((uri, index) => (
              <View key={index} className="image-wrapper">
                <View className="delete-btn" onClick={() => deletePhoto(uri)}>
                  <Text className="delete-text">×</Text>
                </View>
                <Image src={uri} mode="aspectFill" className="preview-image" />
              </View>
            ))}
            <View className="add-btn" onClick={pickImage}>
              <Text className="add-text">+</Text>
            </View>
          </ScrollView>
        </View>

        <FormItem
          name="title"
          control={control}
          required
          error={errors.title}
          rules={{ required: '标题不能为空' }}
        >
          <AtInput
            name="title"
            placeholder="填写标题"
            border={false}
            className="title-input"
          />
        </FormItem>

        <FormItem
          name="content"
          control={control}
          required
          error={errors.content}
          rules={{ required: '内容不能为空' }}
        >
          <AtInput
            name="content"
            placeholder="第一张图片会自动成为封面，竖图更佳！"
            border={false}
            className="content-input"
            type="text"
            multiline
            onLineChange={(e) => setContentHeight(e.detail.height * 20)}
          />
        </FormItem>

        <View className="location-section">
          <View className="location-header" onClick={() => setFold(!fold)}>
            <AtIcon value="map-pin" size={20} color="#fff" className="pin-icon" />
            <Text className="location-text">
              {selectedValues.filter(Boolean).join('·') || '添加地点'}
            </Text>
            <AtIcon 
              value={fold ? 'chevron-right' : 'chevron-down'} 
              size={20} 
              className="arrow-icon"
            />
          </View>

          {!fold && (
            <AtCard className="picker-container">
              <View className="picker-group">
                <Text>国家:</Text>
                <Picker
                  mode="selector"
                  range={placeList.map(c => c.name)}
                  onChange={e => handleCountryChange(placeList[e.detail.value].name)}
                >
                  <View className="picker">{selectedValues[0] || '请选择'}</View>
                </Picker>
              </View>

              <View className="picker-group">
                <Text>省份:</Text>
                <Picker
                  mode="selector"
                  range={filteredProvinces.map(p => p.name)}
                  onChange={e => handleProvinceChange(filteredProvinces[e.detail.value].name)}
                >
                  <View className="picker">{selectedValues[1] || '请选择'}</View>
                </Picker>
              </View>

              <View className="picker-group">
                <Text>城市:</Text>
                <Picker
                  mode="selector"
                  range={filteredCities}
                  onChange={e => setSelectedValues([...selectedValues.slice(0,2), filteredCities[e.detail.value]])}
                >
                  <View className="picker">{selectedValues[2] || '请选择'}</View>
                </Picker>
              </View>
            </AtCard>
          )}
        </View>

        <AtButton 
          type="primary" 
          className="submit-btn"
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
        >
          提交修改
        </AtButton>
      </ScrollView>
    </View>
  )
}

export default EditTravelScreen