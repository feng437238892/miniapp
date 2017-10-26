import _wx from '../../utils/wx.js';
import * as _route from '../../routes/index';
const app = getApp();

Page({
  data: {

  },
  onLoad: function(opt) {

  },
  _walkin() {
    _route.next({
      pages: getCurrentPages()
    });
  },

  _auth() {
    _route.last({
      pages: getCurrentPages(),
      to: 'auth'
    });
  }

})