// 我的游记列表页面
Page({
  data: {
    travelList: [], // 游记列表数据
    userInfo: null // 用户信息
  },

  onLoad() {
    this.checkLoginStatus();
    this.fetchTravelList();
  },

  // 校验登录态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({ url: '/pages/login/login' });
    } else {
      this.setData({ userInfo });
    }
  },

  // 获取游记列表
  fetchTravelList() {
    // 调用接口获取当前用户的游记数据
    wx.request({
      url: 'https://api.example.com/travel/list',
      data: { userId: this.data.userInfo.id },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ travelList: res.data.data });
        }
      }
    });
  },

  // 跳转编辑游记（仅待审核和未通过状态可用）
  editTravel(e) {
    const { status, id } = e.currentTarget.dataset;
    if (status === 'pending' || status === 'rejected') {
      wx.navigateTo({ url: `/pages/TravelPublishPage/TravelPublishPage?travelId=${id}` });
    }
  },

  // 删除游记（物理删除）
  deleteTravel(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '是否删除该游记？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `https://api.example.com/travel/delete/${id}`,
            method: 'DELETE',
            success: (res) => {
              if (res.data.code === 200) {
                this.fetchTravelList(); // 刷新列表
              }
            }
          });
        }
      }
    });
  },

  // 跳转游记发布页
  goToPublish() {
    wx.navigateTo({ url: '/pages/TravelPublishPage/TravelPublishPage' });
  }
});