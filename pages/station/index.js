import _wx from '../../utils/wx';
import _config from '../../utils/config';
import _utils from '../../utils/util';
const app = getApp();

let orderInfo = {};
Page({
  data: {

  },

  onLoad(opt) {
    this._fetchOrderDetail(opt.id);
  },

  _fetchOrderDetail(id) {
    _wx.wxRequest({
      url: _config.server + '/orders/' + id,
    }, (res) => {
      let order = res.data.data;
      if (_utils.isEmpty(order)) {
        // TODO: 错误处理
        _wx.wxBack();
        return;
      }
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
      orderInfo = order;
      app._setCurrentOrder(order);
    }, null, () => {
      this._judgeWhereToGo();
    })
  },

  _judgeWhereToGo() {
    let path = '';
    let mode = '';
    if (_utils.isEmpty(orderInfo)) {
      return;
    }
    const scene = app.scene;
    if (scene && scene.device_id) {
      mode = 'checkin';
      path = '../confirmOrder/index';

    } else if (orderInfo.flow && orderInfo.flow.is_pre_checkin) {
      mode = orderInfo.canCheckout ? 'checkout' : 'pre-checkin';
      path = '../orderDetail/index';
    } else {
      mode = 'pre-checkin';
      path = '../assignRooms/index';
    }
    console.log('=================');
    console.log(mode);
    console.log(path);
    app.data.mode = mode;
    _wx.wxRedirectTo(path);
  }
});