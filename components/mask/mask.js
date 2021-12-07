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
      { id: 1, name: '热门' },
      { id: 2, name: '圣诞帽' },
      { id: 3, name: '国旗' }
    ],
    tabCur: 0,
    maskList: [
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
      { src: '/static/images/mask-01.png', name: '圣诞帽' },
    ]
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
    }
  }
})
