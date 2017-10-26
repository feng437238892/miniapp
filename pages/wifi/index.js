const app = getApp();
import * as _route from '../../routes/index';

Page({
  data: {

  },
  onLoad(opt) {

  },
  _next() {
    _route.next({
      pages: getCurrentPages()
    });
  },
  _branch() {
    _route.branch({
      pages: getCurrentPages()
    });
  }
});