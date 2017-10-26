const app = getApp();
import * as _route from '../../routes/index';
import * as _utils from '../../utils/util';
import * as _wx from '../../utils/wx';

Page({
  data: {
    mobile: "",
    showHintBtn: false,
    isEdit: false
  },

  onLoad(opt) {
    if (!_utils.isEmpty(opt)) {
      this.setData({
        mobile: opt.mobile,
        isEdit: true
      });
      _wx.wxSetNavigationBarTitle('修改手机号码');
    }
  },

  bindKeyInput: function(e) {
    this.setData({
      showHintBtn: e.detail.value.length === 11,
      mobile: e.detail.value
    })
  },

  _next() {
    _route.next({
      pages: getCurrentPages(),
      data: { mobile: this.data.mobile }
    });
  },
});