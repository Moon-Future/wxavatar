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
    maskInfo: {
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
      turnFlag: false // 镜像翻转
    },
    scaleIcon: {
      bottom: -5,
      _bottom: -5,
      right: -10,
      _right: -10
    },
    turnIcon: {
      left: -8,
      _left: -8
    },
    controlShow: false,
    avatarDefault: 'https://wxproject-1255423800.cos.ap-guangzhou.myqcloud.com/project_avatar/default/avatar-detault.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchstart(e) {
      const maskInfo = this.data.maskInfo
      const { clientX, clientY } = e.touches[0]
      this.startTouch = {
        x: clientX, // 移动前坐标点
        y: clientY,
        angle: this.countDeg(maskInfo.x, maskInfo.y, clientX, clientY), // 移动前位置的角度
      }
      this.setData({ controlShow: true })
    },

    touchmove(e) {
      const type = e.currentTarget.dataset.type
      const { maskInfo, scaleIcon, turnIcon } = this.data
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
        scaleIcon.right = scaleIcon._right + maskInfo.w * (1 - maskInfo.scale) / 2
        scaleIcon.bottom = scaleIcon._bottom + maskInfo.h * (1 - maskInfo.scale) / 2
        turnIcon.left = turnIcon._left + maskInfo.w * (1 - maskInfo.scale) / 2
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
      this.setData({
        maskInfo,
        scaleIcon,
        turnIcon
      })
    },

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
      // console.log("ox.oy:", ox, oy)
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

    avatarOnLoad(e) {
      const maskInfo = this.data.maskInfo
      if (maskInfo.avatarW) return
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#avatarImage')
        .boundingClientRect((rect) => {
          maskInfo.avatarW = rect.width
          maskInfo.avatarTop = rect.top
          maskInfo.avatarLeft = rect.left
          this.setData({ maskInfo })
        })
        .exec()
    },

    imgOnLoad(e) {
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#maskImage')
        .boundingClientRect((rect) => {
          console.log('rect111', rect)
          const maskInfo = this.data.maskInfo
          maskInfo.w = rect.width
          maskInfo.h = rect.height
          maskInfo.x = rect.left + rect.width / 2
          maskInfo.y = rect.top + rect.height / 2
          maskInfo.X = maskInfo.x
          maskInfo.Y = maskInfo.y
          maskInfo.offsetTop = rect.top
          maskInfo.offsetLeft = rect.left
          maskInfo.r = this.getDistance(maskInfo.x, maskInfo.y, maskInfo.offsetLeft, maskInfo.offsetTop)
          this.setData({ maskInfo })
        })
        .exec()
    },

    // 复位
    reset(src) {
      const { maskInfo, scaleIcon, turnIcon } = this.data
      maskInfo.top = 0
      maskInfo.left = 0
      maskInfo.x = maskInfo.X
      maskInfo.y = maskInfo.Y
      maskInfo.scale = 1
      maskInfo.angle = 0
      maskInfo.angleHide = 0
      maskInfo.opacity = 1
      maskInfo.turnFlag = false
      maskInfo.src = src || maskInfo.src
      scaleIcon.bottom = scaleIcon._bottom
      scaleIcon.right = scaleIcon._right
      turnIcon.left = turnIcon._left
      this.setData({
        maskInfo,
        scaleIcon,
        turnIcon,
        controlShow: true
      })
    },

    // 隐藏拖拽框
    hideControl() {
      this.setData({ controlShow: false })
    },

    // 改变透明度
    changeOpacity(opacity) {
      const maskInfo = this.data.maskInfo
      maskInfo.opacity = opacity
      this.setData({ maskInfo })
    },

    async savaAvatar() {
      const imageCanvas = this.selectComponent('#imageCanvas')
      const maskInfo = this.data.maskInfo
      const avatarInfo = {
        src: this.data.userInfo.avatarUrl || this.data.avatarDefault
      }
      try {
        wx.showLoading({
          title: '正在保存...',
          mask: true
        })
        const query = wx.createSelectorQuery().in(this)
        query
          .select('#maskImageHide')
          .boundingClientRect(async (rect) => {
            const src = await imageCanvas.saveImage(avatarInfo, { ...maskInfo, left: rect.left - maskInfo.avatarLeft, top: rect.top - maskInfo.avatarTop })
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
          })
          .exec()
      } catch (e) {
        wx.hideLoading()
        console.log(e)
      }
    },

    maskClick() {},

    // 镜像翻转
    turnMask() {
      const maskInfo = this.data.maskInfo
      maskInfo.turnFlag = !maskInfo.turnFlag
      this.setData({ maskInfo })
    }
  },
  
})
