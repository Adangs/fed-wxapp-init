// 全局过滤器
import config from '../config/index' // 全局配置

export default {
  // 数据批量进行过滤器格式化处理
  batchFormat(data, filter, extend = []) {
    switch (Object.prototype.toString.call(data)) { 
      case '[object Object]':
        for (const key in data) {
          data[key] = this[filter](data[key], ...extend)
        }
        return data
      case '[object Array]':
        return data.map(item => {
          return this[filter](item, ...extend)
        })
    }
  },
  // 小数点后补多位0   ==>  12.00000000 || 12.12340000
  formatZero(number = 0, n = 8) {
    if (n <= 0) {
      return Math.round(number)
    }
    number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n) // 四舍五入
    number = Number(number).toFixed(n) // 补足位数
    return number
  },
  // 格式化算力
  formatHash(hash = 0, unit = true, n = 2) {
    const hashRate = Number(hash)
    switch ((wx.getStorageSync('coinType') || config.coinType).toLowerCase()) {
      case 'btc':
        if (hashRate <= 0) {
          return this.formatZero(0, n) + (unit ? ' Th/s' : '')
        } else if (hashRate < 1000) {
          return this.formatZero(hashRate, n) + (unit ? ' Th/s' : '')
        } else if (hashRate >= 1000 && hashRate < 1000000) {
          return this.formatZero(hashRate / 1000, n) + (unit ? ' Ph/s' : '')
        } else if (hashRate >= 1000000) {
          return this.formatZero(hashRate / 1000000, n) + (unit ? ' Eh/s' : '')
        } else {
          return this.formatZero(0, n) + (unit ? ' Th/s' : '')
        }
      case 'ltc':
        // 线上代码没更新
        if (hashRate <= 0) {
          return this.formatZero(0, n) + (unit ? ' Mh/s' : '')
        } else if (hashRate < 1000) {
          return this.formatZero(hashRate, n) + (unit ? ' Mh/s' : '')
        } else if (hashRate >= 1000 && hashRate < 1000000) {
          return this.formatZero(hashRate / 1000, n) + (unit ? ' Gh/s' : '')
        } else if (hashRate >= 1000000) {
          return this.formatZero(hashRate / 1000000, n) + (unit ? ' Th/s' : '')
        } else {
          return this.formatZero(0, n) + (unit ? ' Mh/s' : '')
        }
      case 'xmr':
        if (hashRate <= 0) {
          return this.formatZero(0, n) + (unit ? ' h/s' : '')
        } else if (hashRate < 1000) {
          return this.formatZero(hashRate, n) + (unit ? ' h/s' : '')
        } else if (hashRate >= 1000) {
          return this.formatZero(hashRate / 1000, n) + (unit ? ' Kh/s' : '')
        } else if (hashRate >= 1000000) {
          return this.formatZero(hashRate / 1000000, n) + (unit ? ' Mh/s' : '')
        } else {
          return this.formatZero(0, n) + (unit ? ' h/s' : '')
        }
    }
  },
  // 数据格式化保留小数点   ==>  12,345.12 || 12345.12
  formatNumber(value = 0, precision = 2, string = true) {
    const multiple = Math.pow(10, precision)
    if (string) {
      return (Math.round(value * multiple) / multiple).toLocaleString()
    } else {
      return (Math.round(value * multiple) / multiple)
    }
  },
  // 格式化日期 ==> 2018-01-01 08:00:00
  formatDate(input, b = 'yyyy-MM-dd hh:mm:ss') {
    if (!input) return '-'
    const date = new Date(Number(input) || input.replace(/-/gi, '/'))
    const c = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(b)) {
      b = b.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const a in c) {
      if (new RegExp('(' + a + ')').test(b)) {
        b = b.replace(RegExp.$1, RegExp.$1.length === 1 ? c[a] : ('00' + c[a]).substr(('' + c[a]).length))
      }
    }
    return b
  },
  // 秒转换成天时分 ==> 1d 12h 59m
  formatSecond(time) {
    if (!time) return
    const between = Number(time)
    const day = parseInt(between / 86400, 10) // 天
    const hour = parseInt((between - day * 86400) / 3600, 10) // 小时
    const minute = parseInt((between - day * 86400 - hour * 3600) / 60, 10) // 分
    return `${day}d ${hour}h ${minute}m`
  }
}
