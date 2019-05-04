import config from '../config/index' // 全局配置

// 校验路由是否为tab bar内页面
export function isTabBar(path) {
  return config.tabBarPages.some(item => {
    return path.indexOf(item) !== -1
  })
}
