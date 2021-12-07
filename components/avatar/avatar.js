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
      src: '/static/images/mask-01.png',
      offsetTop: 0,
      offsetLeft: 0,
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      X: 0, // 圆心
      Y: 0, // 圆心
      scale: 1,
      angle: 0,
      opacity: 1
    },
    controlShow: false,
    painterData: {},
    saveImg: ''
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
        r: this.getDistance(maskInfo.x, maskInfo.y, maskInfo.offsetLeft, maskInfo.offsetTop), // 半径
      }
      this.setData({ controlShow: true })
    },

    touchmove(e) {
      const type = e.currentTarget.dataset.type
      const maskInfo = this.data.maskInfo
      const { clientX, clientY } = e.touches[0]
      this.moveTouch = {
        x: clientX,
        y: clientY,
        angle: this.countDeg(maskInfo.x, maskInfo.y, clientX, clientY), // 移动后位置的角度
        dis: this.getDistance(maskInfo.x, maskInfo.y, clientX, clientY), // 移动的点到圆心的距离
      }
      if (type === 'scale') {
        // 缩放
        maskInfo.scale = this.moveTouch.dis / this.startTouch.r
      } else if (type === 'rotate') {
        // 旋转
        maskInfo.angle += this.moveTouch.angle - this.startTouch.angle 
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

    imgOnLoad(e) {
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#maskImage')
        .boundingClientRect((rect) => {
          console.log('rect111', rect)
          const maskInfo = this.data.maskInfo
          maskInfo.x = rect.left + rect.width / 2
          maskInfo.y = rect.top + rect.height / 2
          maskInfo.X = maskInfo.x
          maskInfo.Y = maskInfo.y
          maskInfo.offsetTop = rect.top
          maskInfo.offsetLeft = rect.left
          this.setData({ maskInfo })
        })
        .exec()
    },

    // 复位
    reset(src) {
      const maskInfo = this.data.maskInfo
      maskInfo.top = 0
      maskInfo.left = 0
      maskInfo.x = maskInfo.X
      maskInfo.y = maskInfo.Y
      maskInfo.scale = 1
      maskInfo.angle = 0
      maskInfo.opacity = 1
      maskInfo.src = src || maskInfo.src
      this.setData({ maskInfo })
    },

    hideControl() {
      this.setData({ controlShow: false })
    },

    changeOpacity(opacity) {
      const maskInfo = this.data.maskInfo
      maskInfo.opacity = opacity
      this.setData({ maskInfo })
    },

    savaAvatar() {
      console.log('savaAvatar')
      const maskInfo = this.data.maskInfo
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#maskImage')
        .boundingClientRect((rect) => {
          console.log('rect222', rect, maskInfo)
          const painterData = {
            width: '768rpx',
            height: '768rpx',
            opacity: 0.5,
            views: [
              {
                type: 'image',
                url: this.data.userInfo.avatarUrl || '/static/images/avatar-default.png',
                css: {
                  width: '768rpx',
                  height: '768rpx'
                }
              },
              {
                type: 'image',
                url: maskInfo.src,
                css: {
                  width: rect.width * 3 + 'px',
                  height: rect.height * 3 + 'px',
                  top: maskInfo.top * 3 + 'px',
                  left: maskInfo.left * 3 + 'px',
                  rotate: maskInfo.angle,
                  opacity: 0.5
                }
              }
            ]
          }
          this.setData({ painterData })
        })
        .exec()
    },

    onImgOK(e) {
      console.log('onImgOK', e, e.detail.path)
      const maskInfo = this.data.maskInfo
      maskInfo.src = ''
      this.setData({ saveImg: e.detail.path, maskInfo })
      wx.saveImageToPhotosAlbum({
        filePath: e.detail.path,
        success(res) {
          console.log('res', res)
        }
      })
    },

    onImgErr(e) {
      console.log('onImgErr', e)
    }
  },
})
