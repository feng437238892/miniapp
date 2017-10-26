import _wx from './utils/wx.js';
import _config from './utils/config.js';
import _utils from './utils/util.js';
import mta from './libs/mta_analysis.js';
import './utils/polyfill.js';

App({
  data: {
    mode: 'checkin', //'pre-checkin', // checkin || walkin || service
    isBind: false,
    session: null,
    userId:null,
    currentSuborderId: 0,
    checkinTimeStamp: 0,
    hasCancelRoom: false,
    failureCount: 2, // checkin 每次扫码后调用魔镜的失败次数
    isPaying: false,
  },
  scene: {
    number: 0, // 场景值
    group_id: '',
    hotel_id: '',
    device_id: '',
    order_id: ''
  },
  currentOrder: {},
  userInfo: {
    name: '',
    idcard: '',
    mobile: '',
    avatar_url: ''
  },
  invoiceData: {},
  orderList: [],
  
  onLaunch(opts) {
    mta.App.init({
      "appID":"500434236",
  });
  },

  onShow(opts) {
    if (opts.scene != this.scene.number && opts.scene !== 1034 && opts.signpost != this.scene.signpost) {
      this.scene = {
        group_id: '',
        hotel_id: '',
        device_id: '',
        order_id: '',
        signpost: ''
      }
    }
    this.scene['number'] = opts.scene;
    console.log(this.scene);
    if (this.data.hasCancelRoom) {
      this.data.hasCancelRoom = false;
      // _wx.wxShowDialog({
      //   message: '对不起，您的操作中断，请重新办理。',
      //   cbSuccess: () => {
      //     this.data.hasCancelRoom = false;
      //   }
      // });
    }
  },

  onError(msg) {
    // _wx.wxShowDialog({
    //   title: '小程序错误',
    //   message: msg
    // });
  },

  onHide() {
    let that = this;
    let hasOrder = this.currentOrder.order_id && this.currentOrder.order_id.length > 0 && getCurrentPages().length > 1;
    if (!this.data.isPaying && hasOrder && !this.currentOrder.flow.is_paid) {
      _wx.wxRequest({
        url: _config.server + `/orders/${this.currentOrder.order_id}/cancelroom`,
        method: 'PUT',
      }, () => {
        that.data.hasCancelRoom = true;
      }, () => {});
    }
  },

  _setCurrentOrder(obj) {
    this.currentOrder = Object.assign(this.currentOrder, obj);
  },

  _getCurrentSuborder(id) {
    const subid = id || this.data.currentSuborderId;
    if (_utils.isEmpty(this.currentOrder) || subid.length <= 0) {
      return null;
    }
    const suborder = this.currentOrder.suborders.find((sub) => {
      return ('' + sub.suborder_id) === ('' + subid);
    });
    return suborder;
  },

  _updateSuborder(obj) {
    let currentOrder = this.currentOrder;
    const subid = obj.suborder_id || this.data.currentSuborderId;
    if (_utils.isEmpty(currentOrder) || subid.length <= 0) {
      return null;
    }
    const index = currentOrder.suborders.findIndex((sub) => {
      return ('' + sub.suborder_id) === ('' + subid);
    });
    currentOrder.suborders[index] = obj;
    this.currentOrder = currentOrder;
  },

  _setUser(user) {
    this.userInfo = user;
  },

  _saveInvoiceData(data) {
    this.invoiceData = data;
  },

  _fetchOrderList(cb) {
    _wx.wxShowLoading();
    // 根据场景值(scene)判断请求什么列表,
    let scene = this.scene;
    let filter = 'TODO';
    if (scene.name === 'main' && scene.device_id) {
      filter = 'CHECKIN';
    }
    _wx.wxRequest({
      url: _config.server + '/orders/orders',
      data: {
        filter: filter,
        hotel_id: scene.hotel_id || ''
      }
    }, (res) => {
      let orders = res.data.data || [];
      for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let enterTime = new Date(parseInt(order.in_time));
        let leaveTime = new Date(parseInt(order.out_time));
        order['enterTime'] = {
          day: parseInt(enterTime.getDate()) >= 10 ? enterTime.getDate() : '0' + enterTime.getDate(),
          yearAndMonth: _utils.formatDateToYYYYmm(enterTime),
          weekday: _utils.getWeekdayCN(enterTime)
        };
        order['leaveTime'] = {
          day: parseInt(leaveTime.getDate()) >= 10 ? leaveTime.getDate() : '0' + leaveTime.getDate(),
          yearAndMonth: _utils.formatDateToYYYYmm(leaveTime),
          weekday: _utils.getWeekdayCN(leaveTime)
        };
        order['sum_count'] = 0;
        for (let j = 0; j < order.rooms.length; j++) {
          let room = order.rooms[j];
          order['sum_count'] += room.room_count;
        }
      }
      this.orderList = orders;
      cb && cb(orders);
    }, null, () => {
      _wx.wxHideLoading();
    });
  },

  _fetchOrderDetail(id, cbSuccess, cbError, cbComplete) {
    let data = {};
    if (this.scene.hotel_id) {
      data['hotel_id'] = this.scene.hotel_id;
    }
    _wx.wxRequest({
      url: _config.server + '/orders/' + id,
      data: data,
    }, (res) => {
      try{
        let order = res.data.data;
        if (_utils.isEmpty(order)) {
          throw ('order is empty');
        }
        order['enterTimeYMD'] = _utils.formatDateToYmD(order.in_time);
        order['leaveTimeYMD'] = _utils.formatDateToYmD(order.out_time);

        let fee = [];
        let canCheckout = false;
        let suborders = order.suborders || [];
        let sum = 0;
        for (let i = 0; i < suborders.length; i++) {
          let suborder = suborders[i];
          if (suborder.is_checkin) {
            canCheckout = true;
          }
          let breakfastStr = '';
          if (suborder.breakfast == 0) {
            breakfastStr = '(无早)';
          } else if (suborder.breakfast == 1) {
            breakfastStr = '(单早)';
          } else if (suborder.breakfast == 2) {
            breakfastStr = '(双早)';
          } else if (suborder.breakfast == 2) {
            breakfastStr = '(全早)';
          }
          suborder.breakfastStr = breakfastStr;
          let room_price = suborder.room_price || [];
          room_price.forEach((item) => {
            fee.push({
              type: suborder.room_type_name,
              mmdd: _utils.formatDateTomD(item.date),
              price: item.price
            });
            sum += item.price;
          });
        }
        order['sum_price'] = sum;
        order['fee'] = fee;
        order['isShowPrice'] = false;
        order['canCheckout'] = canCheckout;
        order['showDetail'] = false;
        order['hasInvoice'] = !_utils.isEmpty(order.invoice);
        order['cancelTime'] = _utils.formatDateTohhMM(order.config.enabled_cancel_time);
        this._setCurrentOrder(order);
        cbSuccess && cbSuccess(order);
      } catch (e) {
        cbError && cbError(e);
        _wx.wxShowDialog({
          message: '数据异常，请稍候再试。'
        });
      }
    }, (msg) => {
      cbError ? 
        cbError(msg) : 
        _wx.wxShowDialog({
          message: typeof msg === 'object' ? '网络异常，请稍后再试' : msg,
          cbSuccess: () => {
            _wx.wxSwitchTab('../home/index')
          }
        });
    }, () => {
      cbComplete && cbComplete();
    });
  },
})