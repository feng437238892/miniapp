const app = getApp();
import * as _route from '../../routes/index';

Page({
  data: {

  },

  onLoad(opt) {
    // TODO: 请求订单详情
    console.log(opt);
  },

  // wifi
  _branchWifi() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'wifi'
    });
  },
});