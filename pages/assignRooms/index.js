const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    order: {},
    id: null,
    isCheckinPeople: false,
    showDetail: false,
    showShare: false,
    isShowCodeInfo: false,
    title: '',
    content: '',
    isShowPrice: false
  },

  onLoad(opt) {
  },

  onShow() {
    this.setData({
      order: app.currentOrder
    });
  },

  onHide() {
    // this.setData({
    //   isCheckinPeople: false,
    // });
  },

  _checkinPeople() {
    if (this.data.order.config.enabled_pre_checkin || this.data.order.config.enabled_speed_card) {
      this.setData({
        isCheckinPeople: true
      });
      _wx.wxSetNavigationBarTitle('入住人登记');
    } else {
      this._next();
    }
  },

  _selectRoom(ev) {
    const subid = ev.currentTarget.dataset.subid;
    const number = ev.currentTarget.dataset.number;
    const status = ev.currentTarget.dataset.status;
    app.data.currentSuborderId = subid;
    if(status == 1) {
      _route.branch({
        pages: getCurrentPages(),
        to: 'room',
        data: {
          id: this.data.order.hotel.hotel_id,
          subid: subid,
          number: number
        }
      });
    }
  },

  _changePeople(ev) {
    const subid = ev.currentTarget.dataset.subid;
    app.data.currentSuborderId = subid;
    _route.branch({
      pages: getCurrentPages(),
      to: 'people',
      data: {
        subid: subid
      }
    });
  },

  _next() {
    let order = this.data.order;
    let to = order.flow.is_paid ? 'skipPay' : 'pay';
    console.log(to);
    _route.next({
      pages: getCurrentPages(),
      to: to
    });
  },

  _openMap() {
    const hotel = this.data.order.hotel;
    _wx.wxOpenMap({
      lat: parseFloat(hotel.latitude),
      lng: parseFloat(hotel.longitude),
      name: hotel.name,
      address: hotel.address
    });
  },

  _makePhoneCall() {
    _wx.wxMakePhoneCall(this.data.order.hotel.tel);
  },

  _showDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  _closeShareModal() {
    this.setData({
      showShare: false
    });
  },

  _showShareModal() {
    this.setData({
      showShare: true
    });
  },

  // onShareAppMessage() {
  //   return {
  //     title: '',
  //     path: `pages/station/index?id=${this.data.order.id}`
  //   };
  // },

  _showCodeInfo(ev) {
    let type = ev.currentTarget.dataset.type;
    let title = '',
      content = '';
    if (type === 'room') {
      title = '您可以在此优先选房或换房?';
      content = '· 系统为您呈现您预订房型下的所有房间，附上每个房间的特点，供您挑选。\n\n· 系统会在您完成支付后完成房间锁房，如您未支付，所选房间将不被保留。'
    } else {
      title = '什么是授权码?';
      content = '· 授权码是每个订单使用微前台入住酒店的唯一标识，您可将授权码分享给同住人，同住人同样可以使用微前台入住酒店。\n\n· 您预订酒店后在入住当日会收到包含“授权码”的提示短信。您也可以搜索微信小程序“微前台”，在订单详情中查阅“授权码”。\n\n· 如您不是房间预订人，您可联系预订人，获取授权码，通过微前台完成入住。'
    }
    this.setData({
      isShowCodeInfo: true,
      title: title,
      content: content
    });
  },

  _close() {
    this.setData({
      isShowCodeInfo: false,
      isShowPrice: false
    });
  },

  _showPriceDetail() {
    this.setData({
      isShowPrice: true
    });
  }

});