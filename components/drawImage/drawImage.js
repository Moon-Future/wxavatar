// components/drawImage/drawImage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  lifetimes: {
    ready() {
      const query = wx.createSelectorQuery().in(this)
      query
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          this.canvas = canvas
          this.canvas.width = this.data.width
          this.canvas.height = this.data.width
        })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 640,
    height: 640
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reset() {
      this.canvas.width = this.data.width
      this.canvas.height = this.data.width
    },
    drawImage(params) {
      return new Promise(resolve => {
        const ctx = this.canvas.getContext('2d')
        const image = this.canvas.createImage()
        image.src = params.src
        image.onload = () => {
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          if (params.maskFlag) {
            const ratio = this.canvas.width / params.avatarW
            const scale = params.scale * ratio
            const width = params.w * scale
            const height = params.h * scale
            // 透明度
            ctx.globalAlpha = params.opacity

            if (params.turnFlag) {
              // 水平翻转
              ctx.scale(-1, 1)
              // 旋转
              ctx.translate(-width / 2 - params.left * ratio, height / 2 + params.top * ratio)
              ctx.rotate(-params.angle * Math.PI / 180)
              ctx.drawImage(image, -width / 2, -height / 2, width, height)
            } else {
              // 旋转
              ctx.translate(width / 2 + params.left * ratio, height / 2 + params.top * ratio)
              ctx.rotate(params.angle * Math.PI / 180)
              ctx.drawImage(image, -width / 2, -height / 2, width, height)
            }
            ctx.restore()
          } else {
            ctx.globalAlpha = 1
            ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
          }
          resolve()
        }
      })
    },
    async saveImage(avatarInfo, maskList) {
      this.reset()
      return new Promise(async (resolve, reject) => {
        await this.drawImage(avatarInfo)
        for (let i = 0, len = maskList.length; i < len; i++) {
          await this.drawImage(maskList[i])
        }
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          canvas: this.canvas,
          destWidth: this.data.width,
          destHeight: this.data.height,
          success: (res) => {
            resolve(res.tempFilePath)
          },
          fail: (error) => {
            reject(error)
          }
        }, this)
      })
    }
  },
})
