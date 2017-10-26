import _wx from '../../utils/wx';
import _config from '../../utils/config';
import _utils from '../../utils/util';
import mta from '../../libs/mta_analysis.js';
let app = getApp();

/**
 * 小程序页面真实入口，
 * 做引导作用，
 * 根据参数判断当前采用什么样的路由
 */
Page({
  data: {},

  onLoad(opts) {
    mta.Page.init();
    this.opts = opts;
    app.data.checkinTimeStamp = new Date().getTime();
    app.data.failureCount = 2;
  },

  onReady() {
    this.filterParams(this.opts);
  },

  filterParams(opt) {
    console.log('------', opt);
    if (opt.fromPage == 'register') {
      this._login();
    } else {
      if (app.scene.number === 1014 || app.scene.number === 1043) {
        app.scene['order_id'] = opt.order_id;
        app.scene['signpost'] = opt.signpost;
      } else {
        let params = _utils.parseQueryString(decodeURIComponent(opt.q));
        app.scene['hotel_id'] = opt.hotel_id || params.hotel_id || '';
        app.scene['device_id'] = opt.device_id || params.device_id || '';
        app.scene['signpost'] = opt.signpost || params.signpost || '';
        app.scene['order_id'] = opt.order_id || params.order_id || '';;
      }
      this._login();
    }
  },

  _login() {
    let that = this;
    _wx.wxLogin({
      needPhoneBind: app.scene['signpost'].length === 0 || app.scene['signpost'] === 'DEFAULT'
    }, null, null, (session) => {
      that._judgeWhere2Go();
    });
  },

  _judgeWhere2Go() {
    if (app.scene.order_id) { // do nothing
      this._openSingePage();  
    } else { 
      this._openManually();
    }
  },

  _openManually() {
    app.scene['name'] = 'main';
    app._fetchOrderList((orders) => orders.length <= 0 &&
      app.scene.hotel_id ? this._jumpToWalkin() : this._jumpToHome());
  },

  _openSingePage() {
    app.scene['name'] = 'main';
    app._fetchOrderDetail(app.scene.order_id, () => {
      if (app.scene.signpost === 'ORDER_DETAIL') {
        app.data.mode = 'checkout'
        this._openOrderDetail();
      } else if (app.scene.signpost === 'POLICE_PAY'){
        app.data.mode = 'police-pay'
        this._openPayment();
      } else {
        this._openManually();
      }
    }, (msg) => {
      if (app.scene.signpost === 'BILL'){
        app.data.mode = 'checkout'
        this._openBills();
      } else {
        _wx.wxShowDialog({
          message: typeof msg === 'object' ? '网络异常，请稍后再试' : msg,
          cbSuccess: () => {
            _wx.wxSwitchTab('../home/index')
          }
        });
      }
    });
  },

  _openBills() {
    _wx.wxRedirectTo('../bill/index?order_id=' + app.scene.order_id);
  },

  _openOrderDetail() {
    _wx.wxRedirectTo('../orderDetail/index?order_id=' + app.scene.order_id);
  },

  _openPayment() {
    _wx.wxRedirectTo('../pay/index?order_id=' + app.scene.order_id);
  },

  _jumpToHome() {
    _wx.wxSwitchTab('../home/index');
  },

  _jumpToWalkin() {
    let that = this;
    app.data.mode = 'walkin';
    _wx.wxRedirectTo('../walkinHome/index');
  },

  _scanRoomCode(opt) {
    app.scene['name'] = 'service';
    app.data.mode = 'service';
    _wx.wxRedirectTo('../services/index?id=1&&roomNumber=303');
  },

  _scanSpaceCode(opt) {
    app.scene['name'] = 'main';
  },

});