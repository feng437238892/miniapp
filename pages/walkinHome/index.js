const app = getApp();
import * as _route from '../../routes/index';
import * as _utils_wx from '../../utils/wx';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _i18n from '../../utils/i18n';

Page({
  data: {
    title: '',
    content: '',
    isShowCodeInfo: false
  },

  _walkin() {
    _wx.wxShowDialog({
      message: '该功能正在紧张开发中...'
    });
    // _route.next({
    //   pages: getCurrentPages()
    // });
  },

  _authCode() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'code'
    });
  },

  _authCard() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'mirror'
    });
  },

  _noCardVerify() {
    // TODO: 
    _wx.wxShowDialog({
      message: '该功能正在紧张开发中...'
    });
  },

  _showCodeInfo(ev) {
    let type = ev.currentTarget.dataset.type;
    let title, content;
    if (type == 'code') {
      title = _i18n.hint.CODE_INFO_TITLE;
      content = _i18n.hint.CODE_DEFINITION;
    } else {
      title = _i18n.hint.HOW_TO_READ_ID_CARD_TITLE;
      content = _i18n.hint.HOW_TO_READ_ID_CARD;
    }
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