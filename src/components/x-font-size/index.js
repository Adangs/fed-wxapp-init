// components/x-font-size/index.js
Component({
  externalClasses: ['x-class'],
  options: {
    addGlobalClass: true // 页面 wxss 样式将影响到自定义组件
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 展示值
    value: {
      type: String,
      optionalTypes: [Number],
      value: ''
    },
    // 默认字号 rpx
    size: {
      type: Number,
      value: 34
    },
    // 最多显示个数
    max: {
      type: Number,
      value: 8
    },
    // 超出后缩小换算比
    ratio: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fontSize: 34
  },
  // 数据监听器
  observers: {
    value() {
      this.initSize()
    }
  },
  // 进入页面节点树时执行
  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化显示的文字大小
    initSize() {
      const beyond = String(this.data.value).length * this.data.ratio - this.data.max
      // console.log(String(this.data.value).length * this.data.ratio)
      if (beyond > 0) {
        const size = this.data.size - (beyond / this.data.ratio)
        this.setData({
          fontSize: size
        })
      }
    }
  }
})
