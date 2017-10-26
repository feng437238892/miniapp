const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';

Page({
  data: {
    guestInfoData: [],
    isFetching: true
  },

  onShow() {
    this._getGuestInfo();
  },

  _getGuestInfo() {
    _wx.wxRequest({
      url: _config.server + '/guestsList',
      method: 'POST',
      data: {
        filter: 'mine'
      }
    }, (res) => {
      let guestInfo = res.data.data;
      this.setData({
        guestInfoData: guestInfo
      });
    }, null, () => {
      this.setData({
        isFetching: false
      });
    });
  },

  _next() {
    _route.next({
      pages: getCurrentPages()
    });
  },

  _editPeople(ev) {
    let idx = ev.currentTarget.dataset.index;
    const user = this.data.guestInfoData[idx];
    _route.branch({
      pages: getCurrentPages(),
      data: {
        guestId: user.guest_id,
        name: user.name,
        idcard: user.idcard
      }
    });
  }
});