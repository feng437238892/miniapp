const app = getApp();
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';
import * as _i18n from '../../utils/i18n';

Page({
  data: {
    orders: [],
    intro: [{
      type: 'select',
      title: '优选房',
      img: "../../imgs/home_select.png"
    }, {
      type: 'assure',
      title: '微担保',
      img: '../../imgs/home_assure.png'
    }, {
      type: 'face',
      title: '刷脸住',
      img: '../../imgs/home_face.png'
    }, {
      type: 'invoice',
      title: '秒开票',
      img: '../../imgs/home_invoice.png'
    }],
    isShowCodeInfo: false,
    content: '',
    title: '',
    showContent: false,
    hasOpen: false,
    isFetching: false
  },

  onReady() {
    this.hideLoading();
    let scene = app.scene;
    let data = {
      orders: app.orderList,
      showContent: true,
      mode: 'pre-checkin',
    }
    if (scene.name === 'main' && scene.device_id) {
      data.mode = 'checkin';
    }
    this.setData(data);
  },

  onShow() {
    this.hideLoading();
    app._fetchOrderList((orders) => {
      this.setData({
        showContent: true,
        orders: orders
      });
    });
  },

  _onPressOrderCell(e) {
    console.log(e);
    if (this.data.isFetching) {
      return;
    }
    const id = e.detail.target.dataset.id;
    let params = {};
    params['form_id'] = e.detail.formId;
    params['order_id'] = id;
    this._uploadFormid(params);
    this._getOrderDetail(id);
  },

  _uploadFormid(params) {
    _wx.wxRequest({
      url: _config.server + '/formid',
      data: params,
      method: 'POST'
    }, (res) => {
      
    });
  },

  _branchIntro(ev) {
    let type = ev.currentTarget.dataset.type;
    _wx.wxNavigateTo(`../introduction/index?type=${type}`);
  },

  _showCodeInfo(ev) {
    let type = ev.currentTarget.dataset.type;
    let content, title;
    if (type === 'order') {
      title = _i18n.hint.FIND_NO_ORDER_TITLE;
      content = _i18n.hint.FIND_NO_ORDER_INFO;
    } else {
      title = _i18n.hint.CODE_INFO_TITLE;
      content = _i18n.hint.CODE_DEFINITION;
    }
    this.setData({
      isShowCodeInfo: true,
      content: content,
      title: title
    });
  },

  _close() {
    this.setData({
      isShowCodeInfo: false
    });
  },

  _getOrderDetail(id) {
    this.showLoading();
    app._fetchOrderDetail(id, (order) => {
        this._judgeWhereToGo(order);
    }, null, () => {
      this.hideLoading();
    });
  },

  _judgeWhereToGo(orderInfo) {
    let path = '';
    let mode = '';
    const scene = app.scene;
    if (scene && scene.device_id) {
      mode = orderInfo.status == 4 ? 'checkout' : 'checkin';
      path = orderInfo.status == 4 ? '../orderDetail/index' : '../confirmOrder/index';
    } else if (orderInfo.flow && orderInfo.flow.is_pre_checkin || orderInfo.status == 4 || orderInfo.precheckin_status >= 6) {
      mode = orderInfo.canCheckout ? 'checkout' : 'pre-checkin';
      path = '../orderDetail/index';
    } else {
      mode = 'pre-checkin';
      path = '../assignRooms/index';
    }
    //FIXME: 真机调试时删掉
    // mode = 'checkin';
    // path = '../confirmOrder/index';
    // path = '../orderDetail/index';
    // console.log('=================');
    // console.log(mode);
    // console.log(path);
    app.data.mode = mode;
    _wx.wxNavigateTo(path + `?order_id=${orderInfo.order_id}`, null, null);
  },

  showLoading() {
    this.setData({
      isFetching: true
    });
  },

  hideLoading() {
    this.setData({
      isFetching: false
    });
  },

  _closeModal() {}
});