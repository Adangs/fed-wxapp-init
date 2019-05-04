/*
* 全局工具类导出
* */
import $http from './x-http' // 二次封装 wx.request
import $toast from './x-toast' // 二次封装 wx.showToast
import $filters from './x-filters' // 过滤器

export default {
  $http,
  $toast,
  $filters
}
