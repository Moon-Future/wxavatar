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

const wxml = () => {
  return (
    `
  <view class="container">
    <image class="img avatar" mode="widthFix" src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201712%2F08%2F20171208214551_AFQ2h.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641486983&t=4cefadff3f77be4df576983bc9d7b75a'></image>
    <image class="img mask" mode="widthFix" src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp314207052.jpg&refer=http%3A%2F%2Fimg3.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641487451&t=e19014cad32a4cfb819e9a2980453522'></image>
  </view>
  `
  )
}

const style = {
  container: {
    width: 600,
    height: 600,
    backgroundColor: '#fff',
    position: 'relative'
  },
  img: {
    width: 600,
    height: 600,
  },

  mask: {
    position: 'absolute',
    top: 70,
    left: 0,
    opacity: '0.5',
  }
}

module.exports = {
  formatTime,
  wxml,
  style,
}
