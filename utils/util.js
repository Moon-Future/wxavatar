const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const setNavBar = (globalData) => {
  if (globalData.CustomWidth) return
  const systemInfo = wx.getSystemInfoSync()
	const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
  globalData.StatusBar = systemInfo.statusBarHeight
  globalData.Custom = menuButtonInfo;
  globalData.CustomBar = menuButtonInfo.bottom + menuButtonInfo.top - systemInfo.statusBarHeight
  globalData.CustomWidth = menuButtonInfo.width
}

module.exports = {
  formatTime,
  setNavBar
}
