// components/x-card/index.js
Component({
  externalClasses: ['x-class'],
  options: {
    addGlobalClass: true, // 页面 wxss 样式将影响到自定义组件
    multipleSlots: true // 启用多个slot
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题内容
    title: {
      type: String,
      value: ''
    },
    // 标题下边框线
    line: {
      type: Boolean,
      value: false
    },
    // 圆角
    radius: {
      type: Boolean,
      value: false
    },
    // ICON内容
    icon: {
      type: String,
      value: ''
    },
    // 是否显示 slot name="footer"
    footer: {
      type: Boolean,
      value: false
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

  }
})
