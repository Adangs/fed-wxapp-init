/*
* 全局配置文件
* */
export default {
  baseUrl: 'http://rap2api.taobao.org/app/mock/125191', // API正式地址前缀
  coinType: 'BTC',
  currencyWhite: ['uuid', 'login', 'userInfo'], // API地址需要特殊处理的白名单
  tabBarPages: ['pages/alarm/index', 'pages/overview/index', 'pages/demo/index'] // tabBar页面列表，区分是否需要使用 wx.switchTab
}
