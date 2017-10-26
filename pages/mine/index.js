const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';

let count = 0;
Page({
  data: {
    user: {},
    enableDebug: false
  },

  onLoad(opt) {
    this._userinfo();
  },

  onShow() {
    app.data.mode = 'mine';
  },

  _userinfo() {
    _wx.wxRequest({
      url: _config.server + '/userinfo',
      method: 'GET'
    }, (res) => {
      let user = {};
      user['mobile'] = res.data.data.mobile
      _wx.wxGetUserInfo((res) => {
        user['nickName'] = res.userInfo.nickName;
        user['avatarUrl'] = res.userInfo.avatarUrl || '../../imgs/ic_account_head.png';
        app._setUser(user);
        this.setData({
          user: user
        });
      })
    });
  },

  // 我的手机
  _branchPhone() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'minephone',
    });
  },
  // 常用联系人
  _branchPeople() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'people'
    });
  },
  // 我的发票
  _branchInvoice() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'invoice'
    });
  },
  // 历史订单
  _branchOrder() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'orders'
    });
  },
  // 帮助
  _branchHelp() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'help'
    });
  },

  onClick() {
    if (!wx.canIUse('setEnableDebug') && this.data.enableDebug) {
      return;
    }
    count++;
    if (count > 2 && count < 5) {
      wx.showToast({
        title: `再点击${5 - count}次打开debug模式`
      });
    } else if (count === 5) {
      count = 0;
      wx.showToast({
        title: 'Debug 模式已开启'
      });
      wx.setEnableDebug({
        enableDebug: true
      });
      this.setData({
        enableDebug: true
      });
    }
  },

  closeDebug() {
    wx.setEnableDebug({
      enableDebug: false
    });
    this.setData({
      enableDebug: false
    });
  }

});