const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    historyInfoData: [],
  },

  onLoad(opt) {
    this._getHistoryInfo();
  },
  onShow() {

  },

  _getHistoryInfo() { //网络请求
    _wx.wxRequest({
      url: _config.server + '/orders',
      method: 'GET'
    }, (res) => {
      let historyInfo = res.data.data;
      for (let i = 0; i < historyInfo.length; i++) {
        let order = historyInfo[i];
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
        order['sum_count'] = 0;
        for (let j = 0; j < order.rooms.length; j++) {
          let room = order.rooms[j];
          order['sum_count'] += room.room_count;
        }
      }
      this.setData({
        historyInfoData: historyInfo
      });
    });
  },

  _next(ev) {
    let id = ev.currentTarget.dataset.id;
    _route.next({
      pages: getCurrentPages(),
      data: {
        id: id
      }
    });
  }
});