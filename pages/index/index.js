//index.js
//获取应用实例
const app = getApp()

Page({
  data: { 
    canIUse: wx.canIUse('button.open-type.getUserInfo'), 
  },
  scanCodeEv: function () { 
    wx.scanCode({
      success: (res) => { 
        const ercode = res.result; 
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: `${app.globalData.url}/scanInfo?query=${ercode}`,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(info) { 
            console.log(info)
            if(info.statusCode == 404){
              wx.hideLoading()
              wx.showToast({
                title: info.errMsg,
                icon: 'none',
                duration: 2000
              })
              return
            }
            if (info.data.code == 11) { 
              wx.hideLoading()
              wx.navigateTo({
                url: `/pages/logs/logs?id=${ercode}`,
              })
            }else if (info.data.code == 10) {
              wx.hideLoading()
              wx.navigateTo({
                url: `/pages/errorCode/errorCode`,
              })
            }else{
              wx.hideLoading()   
              
              wx.navigateTo({
                url: `/pages/detail/detail?info=${JSON.stringify(info.data.data)}`,
              })
            }
            
          },
          fail(err) {
            console.log(err)
            wx.hideLoading()
            wx.showToast({
              title: err.errMsg,
              icon: 'none',
              duration: 2000
            })
            // wx.navigateTo({
            //   url: `/pages/errorCode/errorCode`,
            // })

          }


        })
         
      },
      fail: (res) => {
        console.log(res)

        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: `/pages/errorCode/errorCode`,
        })
      },
      complete: (res) => {
      }
    })
  },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse) {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
