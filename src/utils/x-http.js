/*
* 使用方式
const app = getApp()
await app.$http({
  url: 'uuid'
}).then(res => {
  console.log(res)
}).catch(err => {
  console.error(err)
})
* */
import config from '../config/index' // 全局配置
import MAP from '../config/api' // api map
import { isTabBar } from '../utils/x-tools' // 单个工具类方法

const http = options => new Promise((resolve, reject) => {
  const API = []
  if (!/^http/i.test(options.url)) {
    // API域名前缀
    API.push(config.baseUrl)
    // 校验当前接口是否在白名单内
    // if (config.currencyWhite.indexOf(options.url) === -1) {
    //   // 币种前缀处理
    //   API.push('/demo')
    // }
    // 通过map文件匹配具体api地址
    API.push(MAP[options.url])
  } else {
    API.push(options.url)
  }
  // 全局loading
  if (options.loading) {
    wx.showLoading({
      mask: true
    })
  }

  wx.request({
    url: API.join(''),
    method: options.type || 'POST',
    header: {
      // 'content-type': 'application/x-www-form-urlencoded',
      // 'token': wx.getStorageSync('token'), 不使用微信登录，仅使用token校验登录的情况
    },
    data: options.data, // 接口入参
    success(response) {
      // console.info('request complete => ', options.url, response.data)
      const res = response.data
      if (response.statusCode === 200) {
        const code = res.code
        if (res.code && code !== 200) {
          // 不进行统一处理错误提示信息
          if (options.hideError) {
            return reject(res)
          }
          switch (code) {
            // 不进行统一处理错误提示信息的code
            case 700:
            case 999999:
              return reject(res)
            default:
              // API接口错误提示信息统一处理，前期把报错的API地址一同暴露给用户，便于开发人员排查问题
              console.warn('API地址：', API.join(''))
              console.warn('API结果：', res)
              // 统一弹出API返回的错误提示信息
              wx.showToast({
                icon: 'none',
                title: res.msg
              })
          }
          return reject(res)
        } else {
          return resolve(res.body || {})
        }
      } else {
        // 不进行统一处理错误提示信息
        if (options.hideError) {
          return reject(res)
        }
        // 非200的统一错误提示
        wx.showToast({
          icon: 'none',
          title: `${options.url} #${String(response.statusCode)}`
        })
        // 根据当前所在页面进行相关处理
        const query = []
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages()
        if (pages.length) {
          const currentPage = pages[pages.length - 1]
          if (currentPage.route.indexOf('/pages/login/index') === -1) {
            // 通知登录页面，登录成功后返回上一页面
            query.push(`redirect=${encodeURIComponent('/' + currentPage.route)}`)
            // 校验当前页面是否为 tabBar 中的页面
            const isTab = isTabBar(currentPage.route)
            // console.log('isTab', isTab)
            if (isTab) {
              query.push('tabBar=1')
            }
          }
        }
        switch (response.statusCode) {
          case 401:
            // 关闭所有页面，跳转至登录页面
            return wx.reLaunch({
              url: `/pages/login/index${query.length ? '?' + query.join('&') : ''}`
            })
        }
        return reject(res)
      }
    },
    fail(err) {
      reject(err)
    },
    complete() {
      console.info('request complete => ', options.url)
      // 隐藏全局loading
      setTimeout(() => {
        wx.hideLoading()
      }, 1500)
    }
  })
})

export default http
