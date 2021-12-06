const Drag = {
  touchstart(item, e) {
    item.lx = e.touches[0].clientX // 记录点击时的坐标值
    item.ly = e.touches[0].clientY
    return item
  }
}

module.exports = {
  Drag
}