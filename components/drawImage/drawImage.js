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
          ctx.globalAlpha = params.opacity || 1
          ctx.drawImage(image, 0, 0, params.width || this.canvas.width, params.height || this.canvas.height)
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
