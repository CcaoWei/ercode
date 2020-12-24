//logs.js 

Page({
  data: { 
    info:null
  },
  onLoad: function (options) { 
    this.setData({
      info:  JSON.parse(options.info)
    })
  }, 
  // navToList(){
  //   wx.navigateTo({
  //     url: '/pages/list/list',
  //   })
  // },
  
  
  
})
