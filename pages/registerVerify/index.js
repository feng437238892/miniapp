const app = getApp();
import * as _route from '../../routes/index';
import * as _utils from '../../utils/util';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _i18n from '../../utils/i18n';

let setTimer;
const MAX_TIME = 60;
const COUNTRY_CODE = '+86';
Page({
  data: {
    country_code: "",
    verify_code: "", //验证码
    mobile: '',
    showHint: false,
    timer: MAX_TIME,
    codeMsg: MAX_TIME + 's后重新获取',
    canTap: false,
    canDoNext: false,
    errorMsg: '验证码错误，请重试',
    isShowCodeInfo: false,
    rulesTitle: _i18n.hint.USER_RULES_TITLE,
    userRules: _i18n.hint.USER_RULES
  },

  onLoad(opt) {
    this._timer();
    this._sendVerifyCode(opt.mobile);
    this.setData({
      mobile: opt.mobile,
    })
  },

  _doubleclick() {
    if (this.data.canTap) {
      this._timer();
      this._sendVerifyCode();
    }
  },

  _sendVerifyCode(mobile) {
    let phone = mobile ? mobile : this.data.mobile
    _wx.wxRequest({
      url: _config.server + '/sms_vcode',
      data: {
        mobile: COUNTRY_CODE + phone,
        scene: 'BIND_MOBILE'
      },
      method: 'POST'
    }, (res) => {

    });
  },

  _bindPhone() {
    _wx.wxRequest({
      url: _config.server + '/bind_mobile',
      data: {
        mobile: COUNTRY_CODE + this.data.mobile,
        sms_vcode: this.data.verify_code
      },
      method: 'PUT'
    }, (res) => {
      let user = app.userInfo;
      user['mobile'] = COUNTRY_CODE + this.data.mobile;
      app._setUser(user);
      _route.next({
        pages: getCurrentPages()
      });
    }, (msg) => {
      this.setData({
        showHint: true,
        errorMsg: msg
      });
    });
  },

  onUnload: function() {
    clearInterval(setTimer);
  },

  bindInputTap: function(e) {
    this.setData({
      verify_code: e.detail.value,
      canDoNext: e.detail.value.length === 6
    })
  },

  _timer() {
    setTimer = setInterval(() => {
      let timer = this.data.timer;
      if (parseInt(timer) == 0) {
        clearInterval(setTimer);
        this.setData({
          timer: MAX_TIME,
          codeMsg: '重新获取',
          canTap: true
        })
      } else {
        let time = timer - 1
        this.setData({
          timer: time,
          canTap: false,
          codeMsg: time + 's后重新获取'
        })
      }
    }, 1000);
  },

  _next() {
    this._bindPhone();
  },

  _showCodeInfo() {
    this.setData({
      isShowCodeInfo: true
    });
  },

  _close() {
    this.setData({
      isShowCodeInfo: false
    });
  }

});