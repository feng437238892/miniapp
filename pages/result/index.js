const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    mode: '',
    fromPage: '',
    text: '',
    canCheckinOther: false,
    canApplyInvoice: false,
  },

  onLoad(opt) {
      console.log(opt);
      wx.navigateTo({ url: '/pages/mirror/index?id=1' })  
      if(opt.data == 1){
        this.setdata({
          canCheckinOther: false,
          canApplyInvoice: true,
        })
      }
    this.setData({
      fromPage: opt.fromPage || ''
    });
    const mode = app.data.mode;
    this.setData({
      mode: mode
    });
    if (mode === 'checkin') {
      this._checkinJudge();
    } else if (mode === 'pre-checkin') {
      this._preCheckinJudge();
    }
  },

  _preCheckinJudge() {
    const order = app.currentOrder;
    let text = '预登记已完成';
    let subtext = '到店后请至前台“魔镜”设备，\n扫码刷脸即可完成入住。';
    let fromPage = this.data.fromPage;
    if (fromPage === 'invoice') {
      text = '发票已申请成功';
      subtext = '离店前可至前台领取';
    } else {
      let statusBool = order.config.enabled_sign ?
        order.flow.is_signed && order.flow.is_paid :
        order.flow.is_paid;
      let status = statusBool ? 6 : 5;
      _wx.wxRequest({
        url: _config.server + `/orders/${order.order_id}/precheckin_status`,
        data: {
          status: status
        },
        method: 'PUT'
      }, (res) => {

      });
    }
    // && order.flow.is_paid
    this.setData({
      canApplyInvoice: order.config.enabled_invoice && fromPage != 'invoice' && _utils.isEmpty(order.invoice),
      text: text,
      subtext: subtext
    });
  },

  _checkinJudge() {
    const order = app.currentOrder;
    let suborder = app._getCurrentSuborder();
    let fromPage = this.data.fromPage;
    suborder.is_checkin = true;
    app._updateSuborder(suborder);

    const index = order.suborders.findIndex((sub) => {
      return !sub.is_checkin;
    });
    let text = '恭喜您办理成功';
    let subtext = `欢迎入住${suborder.room_number}房间，请不要忘记领取门卡`;
    if (this.data.fromPage === 'invoice') {
      text = '发票已申请成功';
      subtext = '离店前可至前台领取';
    } else {
      app.currentOrder.status = 4;
      app.data.checkinTimeStamp = new Date().getTime();
    }
    this.setData({
      text: text,
      subtext: subtext,
      canCheckinOther: index > -1,
      canApplyInvoice: order.config.enabled_invoice && fromPage != 'invoice' && _utils.isEmpty(order.invoice),
    });
  },

  _next() {
    _route.next({
      pages: getCurrentPages()
    });
  },

  _last() {
    _route.last({
      pages: getCurrentPages()
    });
  },

  _branch() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'invoice'
    });
  }
});