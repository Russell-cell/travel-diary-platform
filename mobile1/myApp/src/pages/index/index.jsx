import Taro from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { Current } from '@tarojs/runtime'
import { Component } from 'react' // 从react导入Component[7](@ref)
import { View } from '@tarojs/components'
import { AtToast } from 'taro-ui'
import './index.scss'

// 导入页面组件
import LoginPage from '../LoginPage/LoginPage'
import RegisterScreen from '../RegisterPage/RegisterPage'
import MainPage from '../main'
import DetailPage from '../TravelDetailPage/TravelDetailPage'
import EditTravelPage from '../../EditTravel/EditTravel'
import EditUserInfoPage from '../../EditUserInfo/EditUserInfo'

// 增强路由配置
// 路由配置对象
const routes = {
  Login: {
    screen: LoginPage,
    navigationOptions: {
      title: '登录'
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      title: '注册'
    }
  },
  Main: {
    screen: MainPage,
    navigationOptions: {
      title: '主页'
    }
  },
  Detail: {
    screen: DetailPage,
    navigationOptions: {
      title: '详情'
    }
  },
  EditTravel: {
    screen: EditTravelPage,
    navigationOptions: {
      title: '编辑游记'
    }
  },
  EditUserInfo: {
    screen: EditUserInfoPage,
    navigationOptions: {
      title: '编辑资料'
    }
  }
}

const routeMap = new Map([
  ['LoginPage', '/pages/LoginPage/LoginPage'],
  ['RegisterPage', '/pages/RegisterPage/RegisterPage'],
  ['Main', '/pages/main'],
  ['TravelDetailPage', '/pages/TravelDetailPage/TravelDetailPage'],
  ['EditTravel', '/EditTravel/EditTravel'],
  ['EditUserInfo', '/EditUserInfo/EditUserInfo']
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