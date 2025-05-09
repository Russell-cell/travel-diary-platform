import Taro from '@tarojs/taro'
import { View, ScrollView, Input, Image } from '@tarojs/components'
import './WaterfallPage.scss'
import { Component } from 'react' 

// 模拟接口数据
const mockApi = {
  async getTravelNotes(page, keyword = '') {
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    // 模拟返回数据，实际开发中应替换为真实接口
    return {
      data: Array.from({ length: 10 }, (_, index) => ({
        id: page * 10 + index + 1,
        title: keyword ? `${keyword}的游记${page * 10 + index + 1}` : `游记${page * 10 + index + 1}`,
        author: {
          name: keyword ? `${keyword}用户` : `用户${page * 10 + index + 1}`,
          avatar: 'https://via.placeholder.com/50x50.png?text=Avatar',
        },
        images: ['https://via.placeholder.com/300x200.png?text=Travel+Image'],
      })),
      hasMore: page < 5
    };
  }
};

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

class WaterfallPage extends Component {
  state = {
    travelNotes: [],
    page: 1,
    hasMore: true,
    keyword: '',
    loading: false
  }

  componentDidMount() {
    this.loadData()
  }

  // 加载数据
  loadData = async (isRefresh = false) => {
    if (this.state.loading || !this.state.hasMore) return
    
    this.setState({ loading: true })
    
    const { page, keyword } = this.state
    const newPage = isRefresh ? 1 : page
    
    try {
      const res = await mockApi.getTravelNotes(newPage, keyword)
      
      this.setState(prevState => ({
        travelNotes: isRefresh ? res.data : [...prevState.travelNotes, ...res.data],
        page: newPage + 1,
        hasMore: res.hasMore,
        loading: false
      }))
    } catch (error) {
      console.error('加载数据失败:', error)
      this.setState({ loading: false })
    }
  }

  // 处理搜索输入
  handleSearchInput = debounce(function (e) {
    const keyword = e.detail.value
    this.setState({ keyword }, () => {
      this.loadData(true)
    })
  }, 500).bind(this)

  // 处理卡片点击
  handleCardClick = (id) => {
    // 跳转到游记详情页，实际开发中应替换为真实路由
    Taro.navigateTo({
      url: `/pages/TravelDetail/TravelDetail?id=${id}`
    })
  }

  render() {
    const { travelNotes, loading, hasMore } = this.state
    
    return (
      <View className='waterfall-page'>
        {/* 搜索框 */}
        <Input
          className='search-input'
          placeholder='搜索游记标题或作者昵称'
          onInput={this.handleSearchInput}
        />
        
        {/* 瀑布流列表 */}
        <ScrollView
          className='waterfall-list'
          scrollY
          onReachBottom={this.loadData}
        >
          {travelNotes.map(note => (
            <View
              key={note.id}
              className='travel-card'
              onClick={() => this.handleCardClick(note.id)}
            >
              <Image src={note.images[0]} className='travel-image' />
              <View className='card-content'>
                <View className='title'>{note.title}</View>
                <View className='author-info'>
                  <Image src={note.author.avatar} className='avatar' />
                  <View className='author-name'>{note.author.name}</View>
                </View>
              </View>
            </View>
          ))}
          
          {loading && <View className='loading'>加载中...</View>}
          {!hasMore && <View className='no-more'>没有更多数据了</View>}
        </ScrollView>
      </View>
    )
  }
}

export default WaterfallPage