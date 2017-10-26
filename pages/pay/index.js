const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    sum: 0,
    prices: [],
    mode: '',
    isPaid: false,
    isShowCodeInfo: false,
    showContent: false,
    canDelayPay: false,
    hasPaidRoomFees: false
  },

  onLoad(opt) {
    this._fetchData();
  },

  _fetchData() {
    const id = app.currentOrder.order_id;
    _wx.wxRequest({
      url: _config.server + `/orders/${id}/fee_detail`,
    }, (res) => {
      let price = res.data.data;
      if (app.data.mode === 'police-pay') {
        price['Ydeposit'] = 0;
        price['Ytotal_fee'] = (parseInt(price.total_fee) - parseInt(price.deposit))/ 100;
        price['Yneed_pay'] = (parseInt(price.need_pay) - parseInt(price.deposit))/ 100;
      } else {
        price['Ydeposit'] =  parseInt(price.deposit) / 100;
        price['Ytotal_fee'] = parseInt(price.total_fee) / 100;
        price['Yneed_pay'] = parseInt(price.need_pay) / 100;
      }
      price['Yprepay'] = parseInt(price.prepay) / 100;
      for (let i = 0; i < price.fees.length; i++) {
        let fee = price.fees[i];
        fee['sum'] = 0;
        for (let j = 0; j < fee.date_price.length; j++) {
          let dp = fee.date_price[j];
          dp['Yprice'] = parseInt(dp.price) / 100;
          dp['dateStr'] = _utils.formatDateToYmD(dp.date);
          fee.sum += dp.Yprice;
        }
        fee['sum'] = fee.sum * fee.amount;
      }
      this.setData({
        price: price,
        mode: app.data.mode,
        isPaid: app.currentOrder.flow.is_paid,
        canDelayPay: app.currentOrder.config.enabled_delayed_payment,
        canCancel: app.currentOrder.config.enabled_cancel,
        cancelTime: app.currentOrder.cancelTime,
        showContent: true,
        hasPaidRoomFees: price.deposit == price.need_pay
      });
    });
  },

  _next() {
    let that = this;
    if (!this.data.isPaid) {
      // FIXME: 0元调接口
      that._doPay();
    } else {
      _route.next({
        pages: getCurrentPages()
      });
    }
  },

  _doPay() {
    _wx.wxRequest({
      url: _config.server + '/payment/get_req_params',
      data: {
        order_id: app.currentOrder.order_id
      },
      method: 'GET'
    }, (res) => {
      let params = res.data.data;
      app.data.isPaying = true;
      _wx.wxPay({
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign
      }, (res) => {
        let order = app.currentOrder;
        app.data.isPaying = false;
        order.flow['is_paid'] = true;
        app._setCurrentOrder(order);
        _route.next({
          pages: getCurrentPages()
        });
      });
    });
  },

  _skip() {
    _wx.wxShowDialog({
      title: '确认到店支付?',
      message: '选择到店支付，当前所选房间将不被保留',
      showCancel: true,
      cbSuccess: () => {
        _route.next({
          pages: getCurrentPages()
        });
      }
    });
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