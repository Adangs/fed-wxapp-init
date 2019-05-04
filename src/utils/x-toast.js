// 二次封装toast提示
const toast = options => {
  const obj = {
    icon: 'none',
    title: '提示信息',
    mask: false,
    duration: 1500
  }
  if (typeof options === 'string') {
    Object.assign(obj, {
      title: options
    })
  } else if (typeof options === 'object') {
    Object.assign(obj, options)
  }

  wx.showToast(obj)
}
export default toast
