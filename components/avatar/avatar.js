Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      default: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    maskList: [],
    avatarDefault: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/default/avatar-detault.png'
  },

  lifetimes: {
    ready() {
      this.maskInfo = {
        id: '',
        src: '',
        avatarW: 0,
        avatarTop: 0,
        avatarLeft: 0, // 头像 dom
        w: 0,
        h: 0,
        offsetTop: 0,
        offsetLeft: 0,
        top: 0,
        left: 0,
        x: 0,
        y: 0,
        X: 0, // 圆心
        Y: 0, // 圆心
        r: 0, // 半径
        scale: 1,
        angle: 0,
        angleHide: 0, // 辅助图片角度，为了计算 left
        opacity: 1,
        maskFlag: true,
        turnFlag: false, // 镜像翻转
        zIndex: -1,
        controlShow: false
      },
      this.index = -1
      this.zIndexMax = 1
      this.maskId = 1
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart(e) {
      const index = e.currentTarget.dataset.index
      const maskList = this.data.maskList
      const maskInfo = maskList[index]
      const { clientX, clientY } = e.touches[0]
      this.startTouch = {
        x: clientX, // 移动前坐标点
        y: clientY,
        angle: this.countDeg(maskInfo.x, maskInfo.y, clientX, clientY), // 移动前位置的角度
      }
      maskList.forEach(ele => {
        ele.controlShow = false
      })
      maskInfo.controlShow = true
      if (this.zIndexMax - maskInfo.zIndex > 1) {
        maskInfo.zIndex = this.zIndexMax
        this.zIndexMax++
      }
      this.index = index
      this.maskOpacity(maskInfo.opacity * 100)
      this.setData({ maskList })
    },

    touchmove(e) {
      const { index, type } = e.currentTarget.dataset
      const maskList = this.data.maskList
      const maskInfo = maskList[index]
      const { clientX, clientY } = e.touches[0]
      this.moveTouch = {
        x: clientX,
        y: clientY,
        angle: this.countDeg(maskInfo.x, maskInfo.y, clientX, clientY), // 移动后位置的角度
        dis: this.getDistance(maskInfo.x, maskInfo.y, clientX, clientY), // 移动的点到圆心的距离
      }
      if (type === 'scale') {
        // 缩放
        maskInfo.scale = this.moveTouch.dis / maskInfo.r
        // 旋转
        maskInfo.angle += this.moveTouch.angle - this.startTouch.angle
        maskInfo.angleHide = -maskInfo.angle
        this.startTouch.angle = this.moveTouch.angle
      } else if (type === 'drag') {
        maskInfo.left += this.moveTouch.x - this.startTouch.x
        maskInfo.top += this.moveTouch.y - this.startTouch.y
        maskInfo.x += this.moveTouch.x - this.startTouch.x
        maskInfo.y += this.moveTouch.y - this.startTouch.y
        this.startTouch.x = clientX
        this.startTouch.y = clientY
      }
      this.setData({ maskList })
    },

    // 计算半径
    getDistance(cx, cy, pointer_x, pointer_y) {
      var ox = pointer_x - cx
      var oy = pointer_y - cy
      return Math.sqrt(ox * ox + oy * oy)
    },

    /*
     *参数1和2为图片圆心坐标
     *参数3和4为手点击的坐标
     *返回值为手点击的坐标到圆心的角度
     */
    countDeg: function (cx, cy, pointer_x, pointer_y) {
      var ox = pointer_x - cx
      var oy = pointer_y - cy
      var to = Math.abs(ox / oy)
      var angle = (Math.atan(to) / (2 * Math.PI)) * 360
      if (ox < 0 && oy < 0) {
        //相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系
        angle = -angle
      } else if (ox <= 0 && oy >= 0) {
        //左下角,3象限
        angle = -(180 - angle)
      } else if (ox > 0 && oy < 0) {
        //右上角，1象限
        angle = angle
      } else if (ox > 0 && oy > 0) {
        //右下角，2象限
        angle = 180 - angle
      }
      return angle
    },

    // 头像加载完成
    avatarOnLoad() {
      if (this.maskInfo.avatarW) return
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#avatarImage')
        .boundingClientRect((rect) => {
          this.maskInfo.avatarW = rect.width
          this.maskInfo.avatarTop = rect.top
          this.maskInfo.avatarLeft = rect.left
        })
        .exec()
    },

    // mask加载完成
    imgOnLoad(e) {
      const index = e.currentTarget.dataset.index
      const query = wx.createSelectorQuery().in(this)
      query
        .selectAll('.maskImage')
        .boundingClientRect((rectList) => {
          const rect = rectList[index]
          const maskList = this.data.maskList
          const maskInfo = maskList[index]
          maskInfo.w = rect.width
          maskInfo.h = rect.height
          maskInfo.x = rect.left + rect.width / 2
          maskInfo.y = rect.top + rect.height / 2
          maskInfo.X = maskInfo.x
          maskInfo.Y = maskInfo.y
          maskInfo.offsetTop = rect.top
          maskInfo.offsetLeft = rect.left
          maskInfo.r = this.getDistance(maskInfo.x, maskInfo.y, maskInfo.offsetLeft, maskInfo.offsetTop)
          this.setData({ maskList })
        })
        .exec()
    },

    // 复位
    reset() {
      const maskList = this.data.maskList
      if (this.index === -1) {
        maskList.forEach(ele => {
          ele = this.maskInfoReset(ele)
          ele.zIndex = 1
        })
        this.zIndexMax = 1
      } else {
        maskList[this.index] = this.maskInfoReset(maskList[this.index])
        maskList[this.index].controlShow = true
      }
      this.setData({ maskList })
    },

    maskInfoReset(maskInfo) {
      maskInfo.top = 0
      maskInfo.left = 0
      maskInfo.x = maskInfo.X
      maskInfo.y = maskInfo.Y
      maskInfo.scale = 1
      maskInfo.angle = 0
      maskInfo.angleHide = 0
      maskInfo.opacity = 1
      maskInfo.turnFlag = false
      maskInfo.controlShow =  false
      return maskInfo
    },

    // mask选择
    maskSelect(src) {
      const maskInfo = JSON.parse(JSON.stringify(this.maskInfo))
      const maskList = this.data.maskList
      if (maskList.length >= 5) {
        wx.showToast({
          title: '5张就够了嘛，再多会卡的哦~',
          icon: 'none'
        })
        return
      }
      if (this.index !== -1) {
        maskList.forEach(ele => {
          ele.controlShow = false
        })
      }
      maskInfo.src = src
      maskInfo.zIndex = this.zIndexMax
      maskInfo.controlShow = true
      maskInfo.id = this.maskId
      maskList.push(maskInfo)
      this.index = maskList.length - 1
      this.maskId++
      this.zIndexMax++
      this.maskOpacity(100)
      this.setData({
        maskList
      })
    },

    // 隐藏拖拽框
    hideControl() {
      const maskList = this.data.maskList
      maskList.forEach(ele => {
        ele.controlShow = false
      })
      this.index = -1
      this.maskOpacity(100)
      this.setData({ maskList })
    },

    // 改变透明度
    changeOpacity(opacity) {
      if (this.index === -1) {
        wx.hideToast({
          title: '请先选中',
          icon: 'none'
        });
        return
      }
      const maskList = this.data.maskList
      const maskInfo = maskList[this.index]
      maskInfo.opacity = opacity
      this.setData({ maskList })
    },

    // 绘图保存
    async savaAvatar() {
      const imageCanvas = this.selectComponent('#imageCanvas')
      const maskList = JSON.parse(JSON.stringify(this.data.maskList))
      const avatarInfo = {
        src: this.data.userInfo.avatarUrl || this.data.avatarDefault
      }
      try {
        wx.showLoading({
          title: '正在保存...',
          mask: true
        })
        maskList.sort((a, b) => {
          return a.zIndex - b.zIndex
        })
        for (let i = 0, len = maskList.length; i < len; i++) {
          const maskInfo = maskList[i]
          const rect = await this.boundingClientRect(maskInfo.id)
          maskInfo.left = rect.left - maskInfo.avatarLeft
          maskInfo.top = rect.top - maskInfo.avatarTop
        }
        const src = await imageCanvas.saveImage(avatarInfo, maskList)
        wx.saveImageToPhotosAlbum({
          filePath: src,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
            })
          },
          fail() {
            wx.hideLoading()
          }
        })
      } catch (e) {
        wx.hideLoading()
        console.log(e)
      }
    },

    boundingClientRect(id) {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query
          .select(`#maskImageHide-${id}`)
          .boundingClientRect(rect => {
            resolve(rect)
          })
          .exec()
      })
    },

    maskClick() {
      // 阻止冒泡
    },

    // 切换mask时更新opacity
    maskOpacity(value) {
      this.triggerEvent('maskOpacity', { opacity: value })
    },

    // 镜像翻转
    turnMask(e) {
      const index = e.currentTarget.dataset.index
      const maskList = this.data.maskList
      const maskInfo = maskList[index]
      maskInfo.turnFlag = !maskInfo.turnFlag
      this.setData({ maskList })
    },

    // 删除
    deleteMask(e) {
      const index = e.currentTarget.dataset.index
      const maskList = this.data.maskList
      maskList.splice(index, 1)
      this.maskOpacity(100)
      this.setData({ maskList })
    }
  },
  
})
