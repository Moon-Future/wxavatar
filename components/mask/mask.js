const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [
      // { id: 1, name: '热门' },
      // { id: 2, name: '圣诞帽' },
      // { id: 3, name: '国旗' }
    ],
    tabCur: 0,
    maskList: [
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
      { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' },
    ]
  },

  lifetimes: {
    async ready() {
      await this.getTabs()
      const tabs = this.data.tabs
      if (tabs.length) {
        await this.getMask(tabs[0].id)
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabSelect(e) {
      const index = e.currentTarget.dataset.index
      this.setData({
        tabCur: index
      })
    },

    maskSelect(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('maskChange', { src: this.data.maskList[index].src })
    },

    async getTabs() {
      try {
        const res = await wx.$http({
          url: 'getAvatarAllTab'
        })
        this.setData({ tabs: res.data })
      } catch (e) {
        console.log(e)
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    },

    async getMask(tab) {
      try {
        const res = await wx.$http({
          url: 'getAvatarMask',
          data: { tab }
        })
        console.log('res', res)
        this.setData({ maskList: res.data })
      } catch (e) {
        console.log(e)
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    }
  }
})
