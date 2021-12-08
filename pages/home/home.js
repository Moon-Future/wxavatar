const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    CustomBar: app.globalData.CustomBar,
    opacity: 100,
    opacityControl: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        const avatarUrlArr = res.userInfo.avatarUrl.split('/')
        avatarUrlArr.pop()
        avatarUrlArr.push('0')
        res.userInfo.avatarUrl = avatarUrlArr.join('/')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  reset() {
    this.setData({ opacity: 100 })
    this.selectComponent('#avatar').reset()
  },

  hideControl() {
    this.selectComponent('#avatar').hideControl()
  },

  maskChange(e) {
    this.setData({ opacity: 100 })
    this.selectComponent('#avatar').reset(e.detail.src)
  },

  opacityShow() {
    this.setData({
      opacityControl: !this.data.opacityControl
    })
  },

  opacityChange(e) {
    const type = e.currentTarget.dataset.type
    const step = 10
    let opacity = this.data.opacity
    if (type === 'add') {
      if (opacity < 100) {
        opacity += step
      }
    } else {
      if (opacity > 0) {
        opacity -= step
      }
    }
    this.setData({ opacity })
    this.selectComponent('#avatar').changeOpacity(opacity / 100)
  },

  savaAvatar() {
    this.selectComponent('#avatar').savaAvatar()
  }
})