// app.js
import utils from './utils/index' // 合并至全局的工具类方法
import { isTabBar } from './utils/x-tools' // 单个工具类方法

/*
* 需要用到 async/await 的页面引出以下内容即可
* const { regeneratorRuntime } = global
* */
Object.assign(global, {
  regeneratorRuntime: require('./libs/runtime')
})
const { regeneratorRuntime } = global

App({
  ...utils,
  // 生命周期回调——监听小程序初始化。
  async onLaunch(options) {
    // console.log(this.globalData.userInfo)
    // 校验token是否存在并且有效
    // console.log('token', wx.getStorageSync('token'))

    // 普通使用 token 登录逻辑
    // if (wx.getStorageSync('token')) {
    //   await this.$http({
    //     hideError: true,
    //     url: 'userInfo'
    //   }).then((res) => {
    //     wx.setStorageSync('accId', res.data.accId)
    //     // wx.setStorageSync('accId', 889135)
    //     Object.assign(this.globalData, {
    //       userInfo: res.data,
    //       currentUser: null
    //     })
    //   }).catch(() => {
    //     // 初始化
    //     this.onAppInit(options)
    //   })
    // } else {
    //   // 初始化
    //   this.onAppInit(options)
    // }
  },
  onShow() {
    
  },
  // 错误或异常时进行数据初始化及界面跳转
  onAppInit(options) {
    // 删除缓存数据
    wx.clearStorageSync('token')
    wx.clearStorageSync('accId')
    this.globalData.userInfo = null
    // 校验要前往的页面是否为 tabBar 中的页面
    const isTab = isTabBar(options.path)
    const query = [`redirect=${encodeURIComponent('/' + options.path)}`]
    if (isTab) {
      query.push('tabBar=1')
    }
    // console.log(`/pages/login/index?${query.join('&')}`)      
    wx.reLaunch({
      url: `/pages/login/index?${query.join('&')}`
    })
  },
  // 全局数据
  globalData: {
    // 用户基本信息
    userInfo: null,
    // 当前选中的子用户数据
    currentUser: null
  }
})
