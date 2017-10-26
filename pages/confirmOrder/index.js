const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    order: {},
    showDetail: false,
    showShare: false,
    isShowCodeInfo: false,
    cantDoNext: true,
    showContent: false
  },

  onLoad(opt) {
    this.setData({
      order: app.currentOrder,
    });
  },

  onShow() {
    if (this.data.showContent) {
      this.setData({
        showContent: false
      });
      app._fetchOrderDetail(app.currentOrder.order_id, (order) => {
        this.setData({
          order: order,
          showContent: true
        });
      }, () => {
        _wx.wxShowDialog({
          message: msg,
          cbSuccess: () => {
            _route.last({
              pages: getCurrentPages()
            });
          }
        });
      });
    } else {
      this.setData({
        showContent: true
      });
    }
    let order = this.data.order;
    let flag = (order.config.enabled_sign && order.flow.is_signed && !order.is_checkin) ||
      (!order.config.enabled_sign && order.flow.is_paid && !order.is_checkin);
    if (flag) {
      _wx.wxSetNavigationBarTitle("办理入住");
    }
  },

  onHide() {
    // this.setData({
    //   showContent: false
    // });
  },

  _next() {
    let order = this.data.order;
    let to = order.flow.is_paid ? 'skipPay' : 'pay';
    let index = order.suborders.findIndex((item) => {
      return item.clean_count == 0 && item.dirty_count == 0 && item.room_number == null;
    });
    console.log(index);
    if (index >= 0) {
      let hint = '系统暂时无法分配所有房间，对于无法分配的房间，您可以找前台营业人员办理。是否选择继续支付办理入住？';
      _wx.wxShowDialog({
        message: hint,
        showCancel: true,
        cbSuccess: () => {
          _route.next({
            pages: getCurrentPages(),
            to: to
          });
        }
      });
    } else {
      _route.next({
        pages: getCurrentPages(),
        to: to
      });
    }
  },

  _selectRoom(ev) {
    const subid = ev.currentTarget.dataset.subid;
    const number = ev.currentTarget.dataset.number;
    _route.branch({
      pages: getCurrentPages(),
      to: 'room',
      data: {
        id: this.data.order.hotel.hotel_id,
        subid: subid,
        number: number
      }
    });
  },

  _changePeople(ev) {
    const subid = ev.currentTarget.dataset.subid;
    _route.branch({
      pages: getCurrentPages(),
      to: 'people',
      data: {
        subid: subid
      }
    });
  },

  _showDetail() {
    this.setData({
      showDetail: !this.data.showDetail,
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

  _applyCard(ev) {
    const subid = ev.currentTarget.dataset.subid;
    app.data.currentSuborderId = subid;
    const suborder = app._getCurrentSuborder(subid);
    let count = suborder.guests ? suborder.guests.length : -1;
    let index = suborder.guests && suborder.guests.findIndex((item) => {
      return !_utils.checkID(item.idcard);
    });
    if (null != index && index >= 0) {
      _wx.wxShowDialog({
        message: "您的入住人信息含有非身份证证件号码。如果您的证件为身份证，请您确认是否输入错误。如果您是非身份证证件办理入住，请您到前台找营业员办理。",
      });
      return;
    }
    let hasDirtyRoom = suborder.room_status_id == 2;
    if (hasDirtyRoom) {
      let hint = suborder.clean_count && suborder.clean_count > 0 ?
        `您的房间${suborder.room_number}尚未打扫，但我们有其他干净房间可选择，您可以选择更换房间。也可以稍等片刻，我们安排人员为您打扫。点击\'取消\'更换房间，点击\'好的\'继续办理入住。` :
        `您的房间${suborder.room_number}尚未打扫，请您等待片刻，我们安排人员为您打扫。是否选择继续办理入住?`;
      _wx.wxShowDialog({
        message: hint,
        showCancel: true,
        cbSuccess: () => {
          _route.branch({
            pages: getCurrentPages(),
            to: 'checkin',
            data: {
              count: count
            }
          });
        }
      });
      return;
    }

    _route.branch({
      pages: getCurrentPages(),
      to: 'checkin',
      data: {
        count: count
      }
    });
  },

  _applyInvoice() {
    _route.branch({
      pages: getCurrentPages(),
      to: 'invoice',
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
  },

});