# 瀑布流游记列表页面文档
测试路径：C:\Program Files (x86)\Tencent\微信web开发者工具
## 功能概述
本页面实现了瀑布流游记卡片列表的展示功能，包含以下特性：
1. 虚拟滚动优化，提升长列表加载性能。
2. 分页加载，每次加载10条审核通过的游记数据。
3. 页面顶部搜索框，支持通过游记标题和作者昵称进行搜索，使用防抖处理优化搜索性能。
4. 点击游记卡片可跳转至对应游记详情页。
5. 两栏不对齐瀑布流布局，列间距14px，卡片高度自适应，通过CSS多列布局实现视觉多样性。

## 页面结构
```
WaterfallPage/
├── WaterfallPage.js       # 页面逻辑文件
├── WaterfallPage.scss     # 页面样式文件
├── WaterfallPage.json     # 页面配置文件
└── README.md              # 本说明文档
```

## 使用方法
### 1. 启动项目
确保项目依赖已安装，在项目根目录下执行以下命令启动开发服务器：
```bash
npm run dev:weapp
```
### 2. 访问页面
在微信开发者工具中打开项目，找到 `WaterfallPage` 页面进行访问。

### 3. 搜索功能
在页面顶部的搜索框输入游记标题或作者昵称，输入完成后稍作等待（防抖时间500ms），页面将自动加载匹配的游记数据。

### 4. 分页加载
滚动页面至底部，页面将自动加载下一页数据，直到没有更多数据为止。

### 5. 跳转详情页
点击任意游记卡片，将跳转到该游记的详情页。

## 代码结构
### WaterfallPage.js
```javascript
// 引入必要的Taro组件和API
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Input, Image } from '@tarojs/components'
import './WaterfallPage.scss'

// 模拟接口数据
const mockApi = {
  async getTravelNotes(page, keyword = '') {
    // 模拟请求延迟
    await Taro.nextTick()
    // 模拟返回数据，实际开发中应替换为真实接口
    return {
      data: Array.from({ length: 10 }, (_, index) => ({
        id: page * 10 + index + 1,
        title: keyword ? `${keyword}的游记${page * 10 + index + 1}` : `游记${page * 10 + index + 1}`,
        author: {
          name: keyword ? `${keyword}用户` : `用户${page * 10 + index + 1}`,
          avatar: 'https://via.placeholder.com/50x50.png?text=Avatar'
        },
        images: ['https://via.placeholder.com/300x200.png?text=Travel+Image']
      })),
      hasMore: page < 5
    }
  }
}

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
```

### WaterfallPage.scss
```scss
.waterfall-page {
  padding: 14px;
  box-sizing: border-box;
}

.search-input {
  width: 100%;
  height: 80px;
  background-color: #f5f5f5;
  border-radius: 40px;
  padding: 0 20px;
  margin-bottom: 20px;
}

.waterfall-list {
  column-count: 2;          // 两列布局
  column-gap: 14px;         // 列间距14px
  padding: 0 14px;         // 配合外层容器内边距
}

.travel-card {
  margin-bottom: 14px;      // 调整卡片垂直间距与列间距一致
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  break-inside: avoid;      // 防止多列布局中卡片被截断
  display: inline-block;   // 配合多列布局的块级展示
  width: 100%;             // 确保卡片宽度占满列宽
  overflow: hidden;
}

.travel-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
}

.author-name {
  font-size: 28px;
  color: #666;
}

.loading, .no-more {
  text-align: center;
  font-size: 28px;
  color: #999;
  padding: 20px 0;
}
```

### WaterfallPage.json
```json
{
  "navigationBarTitleText": "瀑布流游记列表"
}
```

## 注意事项
1. 代码中的 `mockApi` 为模拟接口数据，实际开发中需要替换为真实的后端接口。
2. 跳转详情页的路由 `/pages/TravelDetail/TravelDetail` 需要根据实际项目结构进行调整。
3. 虚拟滚动优化在本实现中通过分页加载和 `ScrollView` 组件的滚动加载实现，若需要更复杂的优化，可以考虑使用第三方虚拟滚动库。
4. 防抖时间设置为500ms，可根据实际需求调整 `debounce` 函数的延迟时间。