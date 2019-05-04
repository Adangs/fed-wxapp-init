// src/pages/alarm/index.js
const { regeneratorRuntime } = global
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: true,
    list: [],
    // 币种icon
    coin: {
      'BTC': 'icon-005',
      'LTC': 'icon-006',
      'XMR': 'icon-007'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initPageData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showLoading() // 显示loading
    this.initPageData(true) // 重新加载所有数据
  },

  // 初始化页面数据
  initPageData(loading) {
    app.$http({
      loading: !!loading,
      url: 'alarmList'
    }).then(res => {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
      const list = res.list
      console.log(list)
      if (list.length) {
        list.forEach(item => {
          Object.assign(item, {
            date: app.$filters.formatDate(item.addTime, 'yyyy年MM月dd日'),
            time: app.$filters.formatDate(item.addTime, 'hh:mm:ss'),
            hashrateFormat: item.hashrate + ' ' + item.hashrateUnit
          })
        })
      }
      this.setData({
        isEmpty: !list.length,
        list
      })
      // console.log(res)
    })
  }
})
