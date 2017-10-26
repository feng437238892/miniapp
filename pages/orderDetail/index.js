const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    showDetail: false,
    order: {},
    id: null,
    showShare: false,
    isShowCodeInfo: false,
    isShowPrice: false
  },

  onLoad() {
    this._buttonConfig(app.currentOrder);
  },

  onReady() {
    this._fetchOrderFee();
  },

  onShow() {
    app._fetchOrderDetail(app.currentOrder.order_id, (order) => {
      this._buttonConfig(order);
    });
  },

  _buttonConfig(order) {
    if (_utils.isEmpty(order)) {
      return;
    }
    let showButton = !order.canCheckout && ((!order.flow.is_signed && order.config.enabled_sign) ||
      (!order.config.enabled_sign && !order.flow.is_paid));
    this.setData({
      order: order,
      showButton: showButton
    });
  },

  _selectRoom(ev) {
    const subid = ev.currentTarget.dataset.subid;
    const number = ev.currentTarget.dataset.number;
    _route.branch({
      pages: getCurrentPages(),
      to: 'room',
      data: {
        id: this.data.order.hotel.hotel_id,
        subid: subid,
        number: number
      }
    });
  },

  _changePeople(ev) {
    const subid = ev.currentTarget.dataset.subid;
    _route.branch({
      pages: getCurrentPages(),
      to: 'people',
      data: {
        subid: subid
      }
    });
  },

  _next() {
    _route.next({
      pages: getCurrentPages()
    });
  },

  _openMap() {
    const hotel = this.data.order.hotel;
    _wx.wxOpenMap({
      lat: parseFloat(hotel.latitude),
      lng: parseFloat(hotel.longitude),
      name: hotel.name,
      address: hotel.address
    });
  },

  _makePhoneCall() {
    _wx.wxMakePhoneCall(this.data.order.hotel.tel);
  },

  _openHint() {

  },

  _showDetail() {
    this.setData({
      showDetail: !this.data.showDetail,
    });
  },

  _checkBill() {
    // TODO: 弹窗展示订单价格详情
  },

  _applyInvoice() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'invoice',
    });
  },

  _closeShareModal() {
    this.setData({
      showShare: false
    });
  },

  _showShareModal() {
    let flag = wx.canIUse("showShareMenu")
    if (flag) {
      _wx.wxShowShareMenu();

    } else {
      this.setData({
        showShare: true
      });
    }
  },

  // onShareAppMessage() {
  //   return {
  //     title: '',
  //     path: `pages/station/index?id=${this.data.order.id}`
  //   };
  // },

  _showCodeInfo() {
    this.setData({
      isShowCodeInfo: true
    });
  },

  _close() {
    this.setData({
      isShowCodeInfo: false,
      isShowPrice: false
    });
  },

  _showPriceDetail() {
    this.setData({
      isShowPrice: true
    });
  },

  _fetchOrderFee() {
    const id = app.currentOrder.order_id;
    _wx.wxRequest({
      url: _config.server + `/orders/${id}/fee_detail`,
    }, (res) => {
      let price = res.data.data;
      price['Ydeposit'] = parseInt(price.deposit) / 100;
      price['Ytotal_fee'] = parseInt(price.total_fee) / 100;
      price['Yprepay'] = parseInt(price.prepay) / 100;
      price['Yneed_pay'] = parseInt(price.need_pay) / 100;
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
      });
    });
  },

  _fetchOrderDetail() {
    let id = this.orderId;
    let scene = app.scene;
    _wx.wxRequest({
      url: _config.server + '/orders/' + id,
      data: {
        hotel_id: scene.hotel_id
      }
    }, (res) => {
      let order = res.data.data;
      order['enterTimeYMD'] = _utils.formatDateToYmD(order.in_time);
      order['leaveTimeYMD'] = _utils.formatDateToYmD(order.out_time);

      let fee = [];
      let canCheckout = false;
      let suborders = order.suborders || [];
      let sum = 0;
      for (let i = 0; i < suborders.length; i++) {
        let suborder = suborders[i];
        if (suborder.is_checkin) {
          canCheckout = true;
        }
        let breakfastStr = '';
        if (suborder.breakfast == 0) {
          breakfastStr = '(无早)';
        } else if (suborder.breakfast == 1) {
          breakfastStr = '(单早)';
        } else if (suborder.breakfast == 2) {
          breakfastStr = '(双早)';
        } else if (suborder.breakfast == 2) {
          breakfastStr = '(全早)';
        }
        suborder.breakfastStr = breakfastStr;
        let room_price = suborder.room_price || [];
        room_price.forEach((item) => {
          fee.push({
            type: suborder.room_type_name,
            mmdd: _utils.formatDateTomD(item.date),
            price: item.price
          });
          sum += item.price;
        });
      }
      order['sum_price'] = sum;
      order['fee'] = fee;
      order['isShowPrice'] = false;
      order['canCheckout'] = canCheckout;
      order['showDetail'] = false;
      order['hasInvoice'] = !_utils.isEmpty(order.invoice);
      order['cancelTime'] = _utils.formatDateTohhMM(order.config.enabled_cancel_time);
      app._setCurrentOrder(order);
    });
  },
});