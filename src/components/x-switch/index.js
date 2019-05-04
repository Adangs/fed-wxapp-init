// src/components/x-switch/index.js

Component({
  externalClasses: ['x-class'],
  options: {
    addGlobalClass: true // 页面 wxss 样式将影响到自定义组件
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题内容
    value: {
      type: Array,
      value: []
    },
    // 选中值
    active: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击切换
    onChange({ currentTarget }) {
      if (currentTarget.dataset.index === this.data.active) return false
      this.setData({
        active: currentTarget.dataset.index
      })
      // 与父级进行通信
      this.triggerEvent('change', this.data.value[currentTarget.dataset.index])
    }
  }
})
