const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _i18n from '../../utils/i18n';

let isFetching = false;
Page({
  data: {
    isShowErrorText: false,
    authCode: '',
    hint: '授权码错误，请重试。',
    isShowCodeInfo: false
  },

  onLoad(opt) {

  },

  _inputAuthCode(e) {
    let authCode = this.data.authCode;
    let value = e.detail.value;
    authCode = value;
    this.setData({
      authCode: authCode,
      isShowErrorText: false
    });
    if (authCode.length === 6 && !isFetching) {
      this._verifyCode(authCode);
    }
  },

  _verifyCode(code) {
    isFetching = true;
    _wx.wxRequest({
      url: _config.server + '/orders/query_and_bind',
      method: 'POST',
      data: {
        hotel_id: app.scene.hotel_id,
        auth_code: code
      }
    }, (res) => {
      if (res.data.data == 0) {
        _route.next({
          pages: getCurrentPages(),
        });
      } else {
        this.setData({
          isShowErrorText: true
        });
      }

    }, () => {
      this.setData({
        isShowErrorText: true
      });
    }, () => {
      isFetching = false;
    });
  },

  _showCodeInfo(ev) {
    let type = ev.currentTarget.dataset.type;
    let title, content;
    title = _i18n.hint.CODE_INFO_TITLE;
    content = _i18n.hint.CODE_DEFINITION;
    this.setData({
      title: title,
      content: content,
      isShowCodeInfo: true
    });
  },

  _close() {
    this.setData({
      isShowCodeInfo: false
    });
  }
});