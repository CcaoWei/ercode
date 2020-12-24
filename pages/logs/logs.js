//logs.js
const util = require('../../utils/util.js')
const app = getApp()
let timer = null
Page({
  data: { 
    info: { purchaseNo: "", courierNo: "",providerName:"",purchaseId:"",entryId:"" ,phone:""},
    hasPhone:false
  },
  onLoad: function (options) { 
    this.setData({
      'info.entryId':options.id
    })

  },
  onShow: function () {
    // purchaseNo: "" 采购单号
    // courierNo: "" 物流单号
    //providerName:"" 供应商名称
    //purchaseId:"" 采购单id
    //entryId:""  二维码id
  },
  navToList() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  scanCode() {
    let that = this;
    wx.scanCode({
      success: (res) => { 
        this.setData({
          'info.courierNo': res.result
        }) 
          wx.request({
            url: `${app.globalData.url}/express`,
            header: {
              'Content-Type': 'application/json', 
          },
          method:"GET",
          data:{
            "query": res.result
    
          },
            success(info) {
              console.log(info)
              console.log(info.data.code)
              if(info.data.data === 'shunfeng'){
                that.setData({
                  hasPhone:true
                })
              }else{
                that.setData({
                  hasPhone:false
                })
              }
    
            },
            fail(err) {
              console.log(err)
    
    
            }
    
    
          })
     
    
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  saveInfo() {
    console.log(this.data.info)
    let that = this;
    if(that.data.info.purchaseNo == "" || that.data.info.courierNo == "" ){
      wx.showToast({
        title: '请正确填写数据',
        icon: 'none',
        duration: 2000
      })
      
      return
    } 
    if(that.data.info.purchaseId == "" || that.data.info.purchaseId == "" ){
      wx.showToast({
        title: '未找到该采购单号',
        icon: 'none',
        duration: 2000
      })
      
      return
    } 
    
    if(that.data.hasPhone && that.data.info.phone == ""){
      
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
      
      return
    } 

    wx.showModal({
      title: '提示',
      content: '确定要保存吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.url}/scanInfo`, //仅为示例，并非真实的接口地址
            method: "POST",
            data: that.data.info,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })

              wx.navigateBack({
                delta: 1,
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  changePhone(val){
    let that = this
    that.setData({
      'info.phone': val.detail.value
    })
  },
  changeNumber(val) {
    let that = this
    that.setData({
      'info.courierNo': val.detail.value
    })

    this.debounce(function(){
      wx.request({
        url: `${app.globalData.url}/express`,
        header: {
          'Content-Type': 'application/json', 
      },
      method:"GET",
      data:{
        "query": val.detail.value

      },
        success(info) {
          console.log(info)
          console.log(info.data.code)
          if(info.data.data === 'shunfeng'){
            that.setData({
              hasPhone:true
            })
          }else{
            that.setData({
              hasPhone:false
            })
          }

        },
        fail(err) {
          console.log(err)


        }


      })

    }.bind(this),2000)()

  },
  changeInput(ercode) {
    console.log(timer)
    if (ercode.detail.value =='')return
    let that = this
    that.setData({
      'info.purchaseNo': ercode.detail.value
    })
    this.debounce(function(){
      wx.request({
        url: `https://erptest.api.harmay.com/erp/v1/purchase_order_query.php`,
        header: {
          'Content-Type': 'application/json',
          'authorization': 'APPCODE cc176be21e0341cdaacea735a0ab75d4'
      },
      method:"POST",
      data:{
        "purchase_no": ercode.detail.value

      },
        success(info) {
          console.log(info.data)
          if (info.data.total_count > 0 ) {
            // info.data.data 
            that.setData({
              'info.providerName': info.data.purchase_list[0].provider_name,
              'info.purchaseId':  info.data.purchase_list[0].purchase_id,
            })
            console.log(that)
            that.setData({
              errorText:""
            })
          }else {
            console.log("???")
            that.setData({
              errorText:"未找到该采购单号"
            })
            that.setData({
              'info.providerName': '',
              'info.purchaseId':  '',
            })
          }

        },
        fail(err) {
          console.log(err)


        }


      })

    }.bind(this),2000)()

  },
  debounce: function (func, wait) {

    return () => {

      clearTimeout(timer);

      timer = setTimeout(func, wait);

    };

  },

})
