const _barHeight = wx.getSystemInfoSync().statusBarHeight

Component({
  externalClasses: ['x-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    //  可传入改变nav back页面数
    delta: {
      type: Number,
      value: 1
    },
    // 下拉刷新...   真机上面好像有问题，晚些再优化
    refresh: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    barHeight: _barHeight,
    isBack: 0
  },
  /**
  * 在组件在视图层布局完成后执行
  * */
  ready() {
    this.setBack()
  },
  methods: {
    // 动态设置返回按钮
    setBack() {
      // eslint-disable-next-line no-undef
      const is = getCurrentPages().length > 1
      this.setData({
        isBack: is
      })
    },
    // 返回上一页
    onNavigateBack() {
      wx.navigateBack({
        delta: 1
      })
    },
    // 滚动到页面顶部
    onBar() {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})
