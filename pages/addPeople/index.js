const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    name: '',
    idCard: '',
    mode: '',
    canDoNext: false,
    guestId: '',
  },

  onLoad(opt) {
    const guestId = opt.guestId;
    let navTitle = (guestId && guestId.length > 0) ? '修改入住人' : '新增入住人';
    _wx.wxSetNavigationBarTitle(navTitle);
    if (guestId && guestId.length > 0) {
      this._canDoNext(opt.name, opt.idcard);
    }
    this.setData({
      guestId: guestId || '',
      mode: app.data.mode,
    });
  },

  _next() {
    // TODO: 网络请求
    let that = this;
    const guestId = this.data.guestId;
    let path = !(guestId && guestId.length > 0) ? '/guests' : `/guests/${guestId}`;
    let method = !(guestId && guestId.length > 0) ? 'POST' : 'PUT';
    _wx.wxRequest({
      url: _config.server + path,
      method: method,
      data: {
        name: that.data.name,
        idcard: that.data.idCard
      }
    }, () => {
      _route.next({
        pages: getCurrentPages()
      });
    });
  },

  _cancel() {
    // 回退
    _route.last({
      pages: getCurrentPages()
    });
  },

  _canDoNext(name, idCard) {
    if (name.length <= 0 || idCard.length <= 0) {
      // TODO: 弹窗提示
    }
    this.setData({
      canDoNext: name.length > 0 && idCard.length > 0,
      name: name,
      idCard: idCard
    });
  },

  _bindInputName(ev) {
    this._canDoNext(ev.detail.value, this.data.idCard);
  },

  _bindInputIDNumber(ev) {
    this._canDoNext(this.data.name, ev.detail.value);
  },

  _delPeople() {
    _wx.wxRequest({
      url: _config.server + `/guests/${this.data.guestId}`,
      method: 'DELETE',
    }, () => {
      _route.next({
        pages: getCurrentPages()
      });
    });
  },

  _ocrIdentity() {
    // TODO: OCR识别
  }

});