import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    order: {}
  },

  onLoad(opt) {
    _wx.wxRequest({
      url: _config.server + `/orders/${opt.order_id}/bills`,
    }, (res) => {
      let order = res.data.data || {};
      order.guests && order.guests.forEach((item) => {
        item = '*' + item.substr(1);
      });
      order['in_time_str'] = _utils.formatDateToYYYYmmDDHHMM(order.in_time);
      order['out_time_str'] = _utils.formatDateToYYYYmmDDHHMM(order.out_time);
      let payment = 0,
        consume = 0;
      order.bills && order.bills.forEach((item) => {
        item['pay_time_str'] = _utils.formatDateTomD2(item.pay_time);
        item['consume'] = parseInt(item.type) === 1 ? Math.abs(item.amount) / 100 : '0.00';
        item['payment'] = parseInt(item.type) === 2 ? Math.abs(item.amount) / 100 : '0.00';
        parseInt(item.type) === 1 && (consume += Math.abs(item.amount)); // 消费
        parseInt(item.type) === 2 && (payment += Math.abs(item.amount)); // 支付
      });
      order['consume'] = consume != 0 ? Math.abs(consume) / 100 : '0.00';
      order['payment'] = payment != 0 ? Math.abs(payment) / 100 : '0.00';
      order['refunds'] = (Math.abs(payment) - Math.abs(consume)) / 100;
      this.setData({
        order: order
      });
    });
  }
});