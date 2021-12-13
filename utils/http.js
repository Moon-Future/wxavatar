// const HOST = 'http://192.168.31.44:5555'
// const HOST = 'http://192.168.137.1:5555'
// const HOST = 'http://localhost:5555'
const HOST = 'https://wxproject.cl8023.com'
const baseUrl = `${HOST}/api/wxAvatar/`

const API = {
  getAvatarAllTab: baseUrl + 'getAvatarAllTab',
  getAvatarMask: baseUrl + 'getAvatarMask',
}

function http(opts) {
  const { url, data, method } = opts
  return new Promise((resolve, reject) => {
    wx.request({
      url: API[url],
      data,
      method: method || 'POST',
      success(res) {
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  http,
  HOST
}