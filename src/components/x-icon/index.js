Component({
  externalClasses: ['x-class'],
  options: {
    addGlobalClass: true // 页面 wxss 样式将影响到自定义组件
  },

  properties: {
    type: {
      type: String,
      value: ''
    },
    custom: {
      type: String,
      value: ''
    },
    size: {
      type: Number
    },
    color: {
      type: String,
      value: ''
    }
  }
})
