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
    pageNo: 1,
    pageSize: 20,
    total: 0,
    maskList: [
      // { src: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/demo/mask-01.png', name: '圣诞帽' }
    ],
    initLoading: false,
    loading: false,
    isPull: true
  },

  lifetimes: {
    async ready() {
      this.setData({ loading: true })
      try {
        await this.getTabs()
        const tabs = this.data.tabs
        if (tabs.length) {
          await this.getMask(tabs[0].id)
        }
      } catch (e) {
        this.setData({ loading: false })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async tabSelect(e) {
      const index = e.currentTarget.dataset.index
      if (this.data.initLoading || this.data.loading || this.data.tabCur === index) return
      this.setData({
        tabCur: index
      })
      await this.getMask({
        refresh: true
      })
    },

    maskSelect(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('maskSelect', { src: this.data.maskList[index] })
    },

    async getTabs() {
      try {
        const res = await wx.$http({
          url: 'getAvatarAllTab'
        })
        const tabs = res.data || []
        tabs.unshift({
          id: 'hot',
          name: '热门'
        })
        this.setData({ tabs })
      } catch (e) {
        console.log(e)
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    },

    async getMask(opts) {
      let { pageNo = 1, total = 0 } = opts
      let maskList = this.data.maskList
      if (!opts.refresh && total !== 0 && maskList.length >= total) return
      try {
        if (pageNo === 1) {
          this.setData({ initLoading: true })
        } else {
          this.setData({ loading: true })
        }
        const res = await wx.$http({
          url: 'getAvatarMask',
          data: { 
            tab: this.data.tabs[this.data.tabCur].id,
            pageNo: pageNo,
            pageSize: this.data.pageSize,
          }
        })
        maskList = opts.refresh ? res.data : maskList.concat(res.data)
        this.setData({ 
          maskList,
          total: res.total,
          pageNo: pageNo + 1,
          initLoading: false,
          loading: false
        })
      } catch (e) {
        console.log(e)
        this.setData({ initLoading: false, loading: false })
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    },

    async lower(e) {
      await this.getMask({
        pageNo: this.data.pageNo,
        total: this.data.total
      })
    },

    async refresh() {
      await this.getMask({
        refresh: true
      })
      this.setData({ isPull: false })
    }
  }
})
