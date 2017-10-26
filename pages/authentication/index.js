const app = getApp();
import * as _route from '../../routes/index';

Page({
  data: {
    count: [1, 2],
    canNoCardCheckin: true
  },

  onLoad(opt) {
    let count = app._getCurrentSuborder().max_guests_count;
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(i);
    }
    this.setData({
      count: arr,
      canNoCardCheckin: app.currentOrder.config.enabled_pre_checkin
    });
  },

  onShow() {
    if (app.currentOrder.status == 4) {
      _route.last({
        pages: getCurrentPages(),
      });
    }
  },

  _branchToMirror(ev) {
    const count = ev.currentTarget.dataset.count;
    _route.next({
      pages: getCurrentPages(),
      data: {
        count: count
      }
    });
  },


  _branchNoIDCard() {
    _route.branch({
      pages: getCurrentPages(),
    });
  },

});