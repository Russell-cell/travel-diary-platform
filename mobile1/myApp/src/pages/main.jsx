import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import HomeScreen from './WaterfallPage/WaterfallPage'
import MyTravelsScreen from './MyTravelList/MyTravelList'
import AddTravelsScreen from './TravelPublishPage/TravelPublishPage'
import './main.scss'

class MainScreen extends Component {
  state = {
    currentTab: '首页'
  }

  LogoTitle = () => (
    <View className="logo-title">
      <Image
        className="logo-img"
        src={require('../../assets/my_icon.png')}
      />
      <Text className="title-text">游记发布</Text>
    </View>
  )

  handleTabClick = (tabName) => {
    this.setState({ currentTab: tabName })
    if (tabName === '游记发布') {
      Taro.navigateTo({ url: '/pages/TravelPublishPage/TravelPublishPage' })
    } else {
      Taro.switchTab({ url: `/pages/${tabName.toLowerCase()}/${tabName.toLowerCase()}` })
    }
  }

  renderTabBar = () => {
    const { currentTab } = this.state
    const tabs = [
      { name: '首页', icon: currentTab === '首页' ? 'home-fill' : 'home' },
      { name: '游记发布', icon: currentTab === '游记发布' ? 'add-fill' : 'add' },
      { name: '我的', icon: currentTab === '我的' ? 'user-fill' : 'user' }
    ]
    return (
      <View className="tab-bar">
        {tabs.map(tab => (
          <View
            key={tab.name}
            className={`tab-item ${currentTab === tab.name ? 'active' : ''}`}
            onClick={() => this.handleTabClick(tab.name)}
          >
            <Text className="tab-icon">{tab.icon}</Text>
            <Text className="tab-text">{tab.name}</Text>
          </View>
        ))}
      </View>
    )
  }

  render() {
    const { currentTab } = this.state
    return (
      <View className="main-container">
        {currentTab === '游记发布' ? (
          <AddTravelsScreen options={{ headerTitle: this.LogoTitle }} />
        ) : currentTab === '我的' ? (
          <MyTravelsScreen options={{ headerShown: false }} />
        ) : (
          <HomeScreen options={{ headerShown: false }} />
        )}
        {this.renderTabBar()}
      </View>
    )
  }
}

export default MainScreen