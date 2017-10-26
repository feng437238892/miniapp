const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';

Page({
  data: {
    user: {}
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this._phoneData();
  },

  _phoneData() {
    _wx.wxRequest({
      url: _config.server + '/userinfo',
      method: 'GET'
    }, (res) => {
      this.setData({
        user: res.data.data
      });
    })
  },

  onShow() {
    var phone = app.userInfo.mobile;
    let newPhone = phone.length > 11 ? phone.substr(3, 11) : phone;
    this.setData({
      mobile: newPhone,
      sms_vcode: '' // opt.sms_vcode
    });
  },

  _next() {
    _route.next({
      pages: getCurrentPages(),
      data: { mobile: this.data.mobile }
    });
  }

})