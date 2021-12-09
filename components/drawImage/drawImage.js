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
          this.canvas.width = 640
          this.canvas.height = 640
        })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    drawImage(params) {
      console.log('eee', params)
      return new Promise(resolve => {
        const ctx = this.canvas.getContext('2d')
        const image = this.canvas.createImage()
        image.src = params.src
        image.onload = () => {
          if (params.maskFlag) {
            const scale = params.scale * (this.canvas.width / params.avatarW)
            const width = params.w * scale
            const height = params.h * scale
            const left = params.left + params.w * (1 - params.scale) / 2
            const top = params.top + params.h * (1 - params.scale) / 2
            console.log(left, top)
            // 透明度
            ctx.globalAlpha = params.opacity
            // 旋转
            ctx.translate(width / 2 + params.left * scale, height / 2 + params.top * scale)
            ctx.rotate(params.angle * Math.PI / 180)
            ctx.drawImage(image, -width / 2, -height / 2, width, height)
          } else {
            ctx.globalAlpha = 1
            ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
          }
          ctx.save()
          resolve()
        }
      })
    },
    async saveImage(avatarInfo, maskInfo) {
      return new Promise(async (resolve, reject) => {
        await this.drawImage(avatarInfo)
        await this.drawImage(maskInfo)
        wx.canvasToTempFilePath({
          canvas: this.canvas,
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
