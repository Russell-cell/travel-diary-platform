// 新增依赖导入
import { getCurrentInstance } from '@tarojs/runtime'
import { Current, Component } from '@tarojs/taro'
import './index.scss'

// 增强路由配置
const routeMap = new Map([
  ['Login', '/pages/Login/index'],
  ['Register', '/pages/Register/index'],
  ['Main', '/pages/Main/index'],
  ['Detail', '/pages/Detail/index'],
  ['EditTravel', '/pages/EditTravel/index'],
  ['EditUserInfo', '/pages/EditUserInfo/index']
])

// 扩展导航方法
const enhancedNavigateTo = (routeName, params) => {
  const path = routeMap.get(routeName)
  if (!path) {
    console.error(`路由${routeName}未注册`)
    return
  }
  
  // 多端参数序列化
  const query = new URLSearchParams(params).toString()
  Taro.navigateTo({
    url: `${path}${query ? `?${query}` : ''}`,
    success: () => {
      // 同步页面栈状态
      Current.router?.onShow?.()
    }
  })
}

class App extends Component {
  // 新增生命周期
  componentDidMount() {
    this.initNavigation()
  }

  // 初始化导航状态
  initNavigation = () => {
    const { path } = getCurrentInstance().router || {}
    if (path) {
      // 同步当前路由状态
      const [routeName] = [...routeMap.entries()]
        .find(([_, value]) => value === path) || []
      this.setState({ currentRoute: routeName })
    }
  }

  // 增强路由跳转（支持页面通信）
  navigateTo = (routeName, params) => {
    this.showToast('info', '导航中...')
    enhancedNavigateTo(routeName, params)
  }

  render() {
    return (
      <View className='app-container'>
        {/* 安全区域适配 */}
        <View className='safe-area-top' />
        
        <View className='route-view'>
          {Object.entries(routes).map(([name, config]) => (
            <config.screen
              key={name}
              navigation={{
                navigate: this.navigateTo,
                state: { 
                  routeName: name,
                  params: Current.router?.params // 注入当前路由参数
                }
              }}
              route={{
                ...config.navigationOptions,
                // 同步页面元信息
                path: routeMap.get(name),
                scene: Current.router?.scene
              }}
            />
          ))}
        </View>

        {/* 增强Toast交互 */}
        <AtToast
          {...this.state.toastConfig}
          hasMask={false}
          onClick={() => this.setState({ toastConfig: { visible: false }})}
        />
      </View>
    )
  }
}