import Taro from '@tarojs/taro'
import { Component } from 'react'  // 关键修改点
import './app.scss'

class App extends Component {
  // 更新生命周期方法命名规范
  componentDidMount() { }

  // 小程序特定生命周期
  onShow() { }

  // 小程序特定生命周期
  onHide() { }

  render() {
    return this.props.children
  }
}

export default App