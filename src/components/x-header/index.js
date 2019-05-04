// components/x-header/index.js
import config from '../../config/index' // 全局配置

const { regeneratorRuntime } = global
const app = getApp()

Component({
  externalClasses: ['x-class'],
  options: {
    addGlobalClass: true // 页面 wxss 样式将影响到自定义组件
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false, // 是否显示选择
    currency: null, // 当前币种
    currencyList: [{
      icon: 'icon-015',
      name: 'BTC',
      value: 'btc'
    }, {
      icon: 'icon-016',
      name: 'LTC',
      value: 'ltc'
    }, {
      icon: 'icon-017',
      name: 'XMR',
      value: 'xmr'
    }],
    user: null, // 当前用户
    userList: [], // 子用户列表
    currentType: null, // 当前类型 currency | user
    showList: [] // 当前显示列表
  },
  // 在组件实例刚刚被创建时执行
  created() {
    // 还未有选中用户，获取对应币种的子用户列表    
    // console.warn(11111, this.data.userList)
    // if (!app.globalData.currentUser) {
    //   this.getUserList()
    // }
    // this.getUserList()
  },
  // 进入页面节点树时执行
  attached() {
    // 初始化数据
    const filter = this.data.currencyList.filter(item => {
      return item.value.toLowerCase() === (wx.getStorageSync('coinType').toLowerCase() || config.coinType.toLowerCase())
    })
    this.setData({
      currency: filter[0]
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户列表
    async getUserList() {
      await app.$http({
        loading: true,
        url: 'accountList',
        data: {
          size: 100,
          page: 1
        }
      }).then(res => {
        const list = res.list
        if (list.length) {
          // 指定第一个子用户为当前选中子用户数据
          app.globalData.currentUser = list[0]
          // 用户列表
          const userList = list.map(item => {
            return {
              // icon: 'icon-018',
              name: item.accName,
              value: item.id
            }
          })
          // 当前选中用户
          wx.setStorageSync('accId', list[0].id)
          const currentUser = {
            name: list[0].accName,
            value: list[0].id
          }
          this.setData({
            user: currentUser,
            userList: userList
          })
        } else {
          this.setData({
            user: null,
            userList: []
          })
        }
        // 与父级进行通信
        this.triggerEvent('load', list)
      })
    },
    // 显示列表
    onShowList({ currentTarget }) {
      let list
      switch (currentTarget.dataset.type) {
        case 'currency':
          list = this.data.currencyList
          break
        case 'user':
          list = this.data.userList
          break
      }

      this.setData({
        show: true,
        showList: list,
        currentType: currentTarget.dataset.type
      })
      // 与父级进行通信
      this.triggerEvent('show', true)
    },
    // 隐藏列表
    onHideList() {
      this.setData({
        show: false
      })
      // 与父级进行通信
      this.triggerEvent('show', false)
    },
    // 切换选择
    async onChange({ currentTarget }) {
      // console.log(this.data.currentType, currentTarget)
      switch (this.data.currentType) {
        case 'currency':
          // 更新缓存的币种类型
          if (currentTarget.dataset.value === this.data.currency.value) return this.onHideList()
          wx.setStorageSync('coinType', currentTarget.dataset.value)
          this.setData({
            currency: this.data.currencyList.filter(item => {
              return item.value.toLowerCase() === currentTarget.dataset.value.toLowerCase()
            })[0]
          })
          // 币种切换后，重新加载子用户数据
          await this.getUserList()
          break
        case 'user':
          // 更新缓存的用户id
          if (currentTarget.dataset.value === this.data.user.value) return this.onHideList()
          wx.setStorageSync('accId', currentTarget.dataset.value)
          this.setData({
            user: this.data.userList.filter(item => {
              return item.value === currentTarget.dataset.value
            })[0]
          })
          break
      }
      // 与父级进行通信
      this.triggerEvent('change', this.data.currentType)
      this.onHideList()
    }
  }
})
