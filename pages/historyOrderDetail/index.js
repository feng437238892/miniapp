const app = getApp();
import * as _route from '../../routes/index';
import * as _utils_wx from '../../utils/wx';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    historyInfoData: {},
    owner_tel: ''
  },

  onLoad(opt) {
    var id = opt.id;
    this._getOderInfo(id);
  },
  _getOderInfo(id) { //网络请求 获取订单详情 
    _wx.wxRequest({
      url: _config.server + '/orders/' + id,
      method: 'GET'
    }, (res) => {
      let order = res.data.data;
      let enterTime = new Date(parseInt(order.in_time) * 1000);
      let leaveTime = new Date(parseInt(order.out_time) * 1000);
      order['enterTime'] = {
        day: parseInt(enterTime.getDate()) > 10 ? enterTime.getDate() : '0' + enterTime.getDate(),
        yearAndMonth: _utils.formatDateToYYYYmm(enterTime),
        weekday: _utils.getWeekdayCN(enterTime)
      };
      order['leaveTime'] = {
        day: parseInt(leaveTime.getDate()) > 10 ? leaveTime.getDate() : '0' + leaveTime.getDate(),
        yearAndMonth: _utils.formatDateToYYYYmm(leaveTime),
        weekday: _utils.getWeekdayCN(leaveTime)
      };
      let tel = order.owner_tel;
      let newPhone = tel.substr(3, 14);
      this.setData({
        historyInfoData: order,
        owner_tel: newPhone
      });
    });
  },
});