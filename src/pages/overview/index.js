// src/pages/overview/index.js
import config from '../../config/index'
import * as echarts from '../../components/ec-canvas/echarts'

const { regeneratorRuntime } = global
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [], // 子用户列表
    coinType: wx.getStorageSync('coinType').toUpperCase() || config.coinType,
    isEmpty: false, // 空白界面
    isScroll: true, // 是否允许滚动
    hash: {}, // 算力
    worker: {}, // 矿机
    income: {}, // 收益
    activeTag: 0, // 当前选中
    chart: null, // 图表渲染对象
    chartData: {
      coinType: 0,
      timeRange: 86400,
      timeType: 2, // 每时
      type: 2
    }, // 图表接口数据
    chartTag: [{
      name: '每时',
      value: 0
    }, {
      name: '每天',
      value: 1
    }] // 图表tag
  },

  // chart Options
  newVisitis: null,
  // chart Options
  chartOptions: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log('page')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getApiData()
    // if (this.data.userList.length) {
    // }
  },

  /**
   * 生命周期函数--下拉刷新
   */
  onPullDownRefresh() {
    wx.showLoading() // 显示loading
    this.getApiData() // 重新加载所有数据
  },

  // 获取界面数据
  async getApiData() {
    await app.$http({
      url: 'overview'
    }).then(res => {
      this.setData({
        hash: app.$filters.batchFormat(res.hash, 'formatHash'),
        worker: app.$filters.batchFormat(res.worker, 'formatNumber'),
        income: app.$filters.batchFormat(res.income, 'formatZero')
      })
    })

    this.getChartData()
  },

  // 公共头部初始化完成
  onLoadHeader({ detail }) {
    this.setData({
      userList: detail,
      isEmpty: !detail.length
    })
    // 加载相关数据
    this.getApiData()
  },

  // 头部组件显示隐藏列表交互
  onShowHeader({ detail }) {
    // console.log(...arguments)
    this.setData({
      isScroll: !detail
    })
  },

  // 头部组件切换币种或用户交互
  onChangeHeader({ detail }) {
    this.getApiData()
    console.log(detail)
  },

  // 提示信息
  onShowTips({ currentTarget }) {
    // console.log(currentTarget.dataset.type)
    let tips
    let title
    const number = this.data.coinType === 'LTC' ? '0.02' : '0.01'
    switch (currentTarget.dataset.type) {
      case 'today':
        title = '今日待分币'
        tips = `最小打币金额为${number}${this.data.coinType}，不足${number}的将会累计延迟支付`
        break
      case 'yesterday':
        title = '昨日实收'
        tips = '昨日实收为国际标准时间昨日0:00-24:00（北京时间昨日8:00～今日8:00）之间的收益'
        break
    }
    wx.showModal({
      title,
      content: tips,
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#33CC99'
    })
  },

  // 图表切换
  onChangeChart({ detail }) {
    this.setData({
      chartData: {
        coinType: 0,
        timeRange: detail.value ? 2592000 : 86400, // 每时 | 每天
        timeType: detail.value ? 1 : 2, // 每时 | 每天
        type: 2
      },
      activeTag: detail.value
    })
    this.getChartData()
  },

  // 获取图表数据
  getChartData() {
    // 初始化基础数据
    this.newVisitis = {
      xAxisData: [],
      dataList: [{
        name: '算力',
        unit: 'TH/s',
        min: 0,
        max: 100,
        data: []
      }, {
        name: '拒绝率',
        unit: '%',
        min: 0,
        max: 100,
        data: []
      }]
    }
    this.setData({
      chart: null
    })
    // 请求图表数据
    app.$http({
      url: 'chartsList',
    }).then(res => {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
      const data = res.list
      const hashrate = []
      const rejectRatio = []
      data.forEach(item => {
        // x的数据自行格式化，此处仅转换为毫秒
        this.newVisitis.xAxisData.push(item.dataTime * 1000)
        
        hashrate.push(item.hashrate ? app.$filters.formatNumber(item.hashrate, 2, false) : item.hashrate)
        rejectRatio.push(item.rejectRatio)
      })

      // 算力最大值比真实最多值多20%
      let lMax = app.$filters.formatNumber(Math.max.apply(null, hashrate), 2, false)
      lMax = lMax > 10 ? app.$filters.formatNumber(lMax * 1.2, 0, false) : 10
      // 拒绝率，最少值20，超过20最大值保持在真实的最大值20%
      let rMax = app.$filters.formatNumber(Math.max.apply(null, rejectRatio))
      rMax = rMax > 100 ? app.$filters.formatNumber(rMax, 0, false) : 100
      // console.log(lMax, rMax)
      // 算力
      if (lMax >= 1000000) {
        // 当前币种
        switch (this.data.coinType) {
          case 'btc':
            this.newVisitis.dataList[0].unit = 'PH/s'
            this.newVisitis.dataList[0].data = hashrate.map(item => {
              return app.$filters.formatNumber(item / 1000, 2, false)
            })
            break
          case 'ltc':
            this.newVisitis.dataList[0].unit = 'GH/s'
            this.newVisitis.dataList[0].data = hashrate.map(item => {
              return app.$filters.formatNumber(item / 1000, 2, false)
            })
            break
          case 'xmr':
            this.newVisitis.dataList[0].unit = 'KH/s'
            this.newVisitis.dataList[0].data = hashrate.map(item => {
              return app.$filters.formatNumber(item / 1000, 2, false)
            })
            this.newVisitis.dataList[0].max = app.$filters.formatNumber(lMax / 1000, 2, false)
            break
        }
      } else {
        // Th/s
        switch (this.data.coinType) {
          case 'btc':
            this.newVisitis.dataList[0].unit = 'Th/s'
            break
          case 'ltc':
            this.newVisitis.dataList[0].unit = 'Mh/s'
            break
          case 'xmr':
            this.newVisitis.dataList[0].unit = 'h/s'
            break
        }
        this.newVisitis.dataList[0].data = hashrate
        this.newVisitis.dataList[0].max = lMax
      }
      // 拒绝率
      this.newVisitis.dataList[1].max = rMax
      this.newVisitis.dataList[1].data = rejectRatio.map(item => {
        // 拒绝率与算力保持一个线上
        return app.$filters.formatNumber(item * this.newVisitis.dataList[0].max / rMax, 2, false)
      })
      // console.log(this.newVisitis)
      this.setOptions(this.newVisitis)
    })
  },
  // 格式化图表参数
  setOptions({ dataList, xAxisData }) {
    const self = this
    this.chartOptions = {
      xAxis: {
        data: xAxisData,
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: '#B2B2B2',
            fontSize: 9
          },
          // 格式化X数据显示
          formatter: (value, index) => {
            if (self.data.activeTag) {
              // 每天
              return app.$filters.formatDate(value, 'MM-dd')
            } else {
              // 每时
              const time = app.$filters.formatDate(value, 'hh:mm')
              if (time === '00:00') {
                return app.$filters.formatDate(value, 'MM-dd') 
              } else {
                return time
              }
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgb(238,238,238)',
            width: 1
          }
        },
        axisTick: {
          show: false
        }
      },
      grid: {
        left: 5,
        right: 5,
        bottom: 0,
        top: 30,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#E5E5E5'
          }
        },
        textStyle: {
          fontSize: 10,
          textBorderColor: '#000',
          textBorderWidth: 1
        },
        position: (pos, params, el, elRect, size) => {
          const obj = { top: 30 }
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
          return obj
        },
        backgroundColor: 'rgba(255, 174, 52, .9)',
        formatter(params) {
          const tips = []
          // console.log(params)
          tips.push(`${app.$filters.formatDate(params[0].axisValueLabel, self.data.activeTag ? 'yyyy/MM/dd' : 'yyyy/MM/dd hh:mm')}\n`)
          params.forEach(item => {
            if (item.seriesName === '算力') {
              // 算力
              tips.push(`${dataList[0].name}：${(params[0].data).toLocaleString()} ${dataList[0].unit}\n`)
            } else {
              // 计算拒绝率
              let ratio = Number(item.data)
              ratio = ratio ? app.$filters.formatNumber(ratio * Number(dataList[1].max) / Number(dataList[0].max), 2, false) : ratio
              tips.push(`${item.seriesName}：${ratio.toFixed(2)} %`)
            }
          })
          return tips.join('')
        },
        padding: [3, 8]
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          min: dataList[0].min,
          // max: dataList[0].max,
          name: `${dataList[0].name} (${dataList[0].unit})`,
          nameTextStyle: {
            padding: [0, 0, 0, 30],
            color: '#353535',
            fontSize: 12
          },
          axisLabel: {
            formatter: `{value}`,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 9
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['rgb(238,238,238)']
            }
          }
        },
        {
          type: 'value',
          scale: true,
          min: dataList[1].min,
          max: dataList[1].max,
          name: `${dataList[1].name} (${dataList[1].unit})`,
          nameTextStyle: {
            padding: [0, 20, 0, 0],
            color: '#353535',
            fontSize: 12
          },
          axisLabel: {
            formatter: `{value}`,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 9
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false // 不显示背影辅助线
          }
        }
      ],
      series: [{
        name: `${dataList[0].name}`,
        showSymbol: false, // 显示点
        itemStyle: {
          normal: {
            color: 'rgb(26,182,255)',
            lineStyle: {
              color: 'rgb(26,182,255)',
              width: 2
            }
          }
        },
        smooth: true,
        type: 'line',
        data: dataList[0].data,
        animation: true
      },
      {
        name: dataList[1].name,
        showSymbol: false,
        smooth: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: 'rgb(41,207,201)',
            lineStyle: {
              color: 'rgb(41,207,201)',
              width: 2
            }
          }
        },
        data: dataList[1].data,
        animation: true
      }]
    }
    // console.log(this.chartOptions)
    this.setData({
      chart: {
        onInit: this.initChart
      }
    })
  },
  // 初始化图表
  initChart(canvas, width, height) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    })
    canvas.setChart(chart)
    chart.setOption(this.chartOptions)
    return chart
  }
})
