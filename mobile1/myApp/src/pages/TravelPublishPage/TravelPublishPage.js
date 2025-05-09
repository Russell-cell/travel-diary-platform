import Taro from '@tarojs/taro'
import { View, Input, Textarea, Image, Button } from '@tarojs/components'
import Compressor from 'compressorjs'
import './TravelPublishPage.scss'
import { Component } from 'react' 

class TravelPublishPage extends Component {
  state = {
    title: '',
    content: '',
    images: [],
    video: null,
    error: ''
  }

  componentDidMount() {
    this.checkLoginStatus()
  }

  checkLoginStatus = () => {
    const isLoggedIn = Taro.getStorageSync('isLoggedIn')
    if (!isLoggedIn) {
      Taro.navigateTo({ url: '/pages/Login/Login' })
    }
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.detail.value })
  }

  handleContentChange = (e) => {
    this.setState({ content: e.detail.value })
  }

  handleImageUpload = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      count: 9 - this.state.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    })

    const compressedImages = await Promise.all(
      tempFilePaths.map(filePath => 
        new Promise((resolve) => {
          new Compressor(Taro.getFileSystemManager().readFileSync(filePath), {
            quality: 60,
            success: (compressedResult) => {
              resolve(compressedResult)
            },
            error: (err) => {
              console.error('图片压缩失败:', err)
              resolve(filePath)
            }
          })
        })
      )
    )

    this.setState(prevState => ({ 
      images: [...prevState.images, ...compressedImages]
    }))
  }

  handleVideoUpload = async () => {
    const { tempFilePath } = await Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back'
    })
    this.setState({ video: tempFilePath })
  }

  handleSubmit = async () => {
    const { title, content, images } = this.state
    if (!title || !content || images.length === 0) {
      this.setState({ error: '标题、内容和图片均为必填项' })
      return
    }

    try {
      const travelId = Date.now().toString() // 生成唯一 ID
      // 模拟发布到数据库
      await Taro.request({
        url: 'https://your-api-endpoint.com/travels',
        method: 'POST',
        data: {
          id: travelId,
          title,
          content,
          images,
          video: this.state.video
        }
      })
      Taro.navigateBack()
      Taro.showToast({ title: '发布成功' })
    } catch (error) {
      console.error('发布失败:', error)
      this.setState({ error: '发布失败，请重试' })
    }
  }

  render() {
    const { title, content, images, video, error } = this.state
    
    return (
      <View className='travel-publish-page'>
        {error && <View className='error-message'>{error}</View>}
        
        <Input
          className='title-input'
          placeholder='请输入标题'
          value={title}
          onChange={this.handleTitleChange}
        />
        
        <Textarea
          className='content-textarea'
          placeholder='请输入内容'
          value={content}
          onChange={this.handleContentChange}
        />
        
        <View className='upload-section'>
          <Button onClick={this.handleImageUpload}>上传图片</Button>
          <View className='image-preview'>
            {images.map((image, index) => (
              <Image key={index} src={image} className='preview-image' />
            ))}
          </View>
        
          <Button onClick={this.handleVideoUpload}>上传视频</Button>
          {video && <View>视频已选择: {video}</View>}
        </View>
        
        <Button className='submit-button' onClick={this.handleSubmit}>发布</Button>
        <Button className='jump-button' onClick={() => {
          Taro.navigateTo({
            url: '/pages/WaterfallPage/WaterfallPage'
          }).catch((error) => {
            console.error('页面跳转失败:', error);
            this.showToast({ title: '页面跳转失败，请稍后重试' });
          });
        }}>
          跳转至瀑布流页面
        </Button>
      </View>
    )
  }
}

export default TravelPublishPage