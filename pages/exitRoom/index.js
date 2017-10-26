const app = getApp();
import * as _route from '../../routes/index';

Page({
  data: {
    showModal: false,
    suborders: [],
    canConfirm: false,
    exitTimeRange: ['立即退房'], // 网络请求
    consumeRange: ['无消费', '有消费'],
    damageRange: ['无损坏', '有损坏'],
    exitTimeValue: 0,
    consumeValue: 0,
    damageValue: 0,
  },

  onLoad(opt) {
    let showModal = false;
    let roomStr = '';
    const order = app.currentOrder;
    let suborders = order.suborders;
    let subs = [];
    suborders.forEach((item) => {
      if (item.is_checkin) {
        item['checked'] = true;
        subs.push(item);
      }
    });
    if (subs.length === 1) {
      showModal = true;
      roomStr = subs[0].room_number + '';
    }
    this.setData({
      showModal: showModal,
      suborders: subs,
      roomStr: roomStr
    });
  },

  _nextToShow() {
    this.setData({
      showModal: true
    });
  },

  _hide() {
    this.setData({
      showModal: false
    });
  },

  _next() {
    _route.next({
      pages: getCurrentPages(),
    });
  },

  _selectRoom(ev) {
    const index = ev.currentTarget.dataset.index;
    let suborders = this.data.suborders;
    suborders[index]['checked'] = !suborders[index]['checked'];
    let roomStr = '';
    suborders.forEach((item) => {
      if (item.checked) {
        roomStr += item.room_number + ', ';
      }
    });
    roomStr = roomStr.substr(0, roomStr.length - 2);
    this.setData({
      roomStr: roomStr,
      suborders: suborders
    });
  },

  _approveAgreement() {
    this.setData({
      canConfirm: !this.data.canConfirm
    });
  },

  _bindPicekerChange(ev) {
    const type = ev.currentTarget.dataset.type;
    let data = this.data;
    data[`${type}Value`] = ev.detail.value;
    this.setData(data);
  }

});