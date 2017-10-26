const app = getApp();
import * as _route from '../../routes/index';
import * as _config from '../../utils/config.js'
import * as _wx from '../../utils/wx';
import * as _utils from '../../utils/util'
let MIRROR_TOPIC = "";
let DEVICE_TOPIC = "";

Page({
  data: {
    hint: "请在设备下方刷身份证",
    params: {
      sender: "",
      cmd: "",
      code: 0,
      data: {},
      user_id:""
    },
    count: 0,
    isFindOrder: false,
    buttonText: ''
  },

  onLoad(opt) {
    let timeStamp = app.data.checkinTimeStamp;
    let hint = "操作超时，请重新扫码办理。";
    let flag = ((new Date().getTime() - timeStamp) / 1000 / 60) > 3;
    if (!flag && app.data.failureCount <= 0) {
      flag = true;
      hint = "失败次数过多，请重新扫码或前往前台办理。"
    }

    if (flag) {
      _wx.wxShowDialog({
        message: hint,
        cbSuccess: () => {
          _route.last({
            pages: getCurrentPages(),
            to: 'home'
          });
        }
      });
      return;
    }
    DEVICE_TOPIC = _config.yunbaTopic + app.data.session;
    MIRROR_TOPIC = "devices/" + app.scene.device_id;
    // 根据当前suborder判断 是需要刷身份证还是直接刷脸
    this.setData({
      count: opt.count || 1,
      isFindOrder: opt.count == undefined,
      buttonText: opt.count == undefined ? '' : app._getCurrentSuborder().room_number + '房 入住成功',
     
    });
    this._initYunbaService();
  },

  onUnload() {
    this.reqTask && this.reqTask.abort();
  },

  _lastExit() {
    // let orderId = app.currentOrder.order_id;
    let currentSuborderId = app.data.currentSuborderId;
    _wx.wxRequest({
      url: _config.server +  `/suborders/${currentSuborderId}/status`,
     
    }, (res) => {
      if (parseInt(res.data.data) === 4) {
        _route.next({
          pages: getCurrentPages(),
          
        });
      } else {
        _wx.wxShowDialog({
          message: '您尚未入住成功，请完成刷脸核验',
        });
      }
    });
   
  },

  _initYunbaService() {
    // this._initYunbaListener();
    if (this.data.isFindOrder) {
      this._checkOrderByIDCard();
    } else {
      this._requestReadIDCard();
    }
  },

  _requestReadIDCard() {
    let params = this.data.params;
    params.cmd = "3003";
    const order = app.currentOrder;
    const suborder = app._getCurrentSuborder();
    let guests = [];
    suborder.guests && suborder.guests.forEach((item) => {
      guests.push({
        idnumber: item.idcard,
        idcard: item.idcard,
        name: item.name
      });
    });
    let data = {
      can_nocard: order.config.enabled_pre_checkin,
      in_time: order.in_time,
      out_time: order.out_time,
      room_no: suborder.room_number,
      room_lock_sn: '1-3-5',
      guest_count: this.data.count,
      guests: guests,
      suborder_id: suborder.suborder_id,
      user_id:app.data.userId
    };
    params['sender'] = DEVICE_TOPIC;
    params['data'] = data;
    if (!order.config.enabled_pre_checkin) {
      params.data.guests = [];
    }
    let body = {};
    body.msg = params;
    body.expires = 10000;
    this.publish(body, (res) => {
      if (res.data.data.cmd === '4000') {
        let hint = res.data.data.code === '401' ? "设备已被他人使用，请稍候办理。" : '出现了一个错误，请重试';
        _wx.wxShowDialog({
          message: hint,
          cbSuccess: () => {
            _route.last({
              pages: getCurrentPages()
            });
          }
        });
      }
    });
  },

  _checkOrderByIDCard() {
    let params = this.data.params;
    params['sender'] = DEVICE_TOPIC;
    params['data'] = {
      session: getApp().data.session,
      guest_count: 1
    };
    params.cmd = "3005";
    let body = {};
    body.msg = params;
    body.loadingMsg = '等待读取';
    body.expires = 60000;
    this.publish(
      body,
      (res) => this._handleCheckinResult(res.data)
    );
  },

  publish(data, success) {
    let params = data.msg;
    params['tid'] = _utils.getUniqueId();
    this.reqTask = _wx.wxRequest({
      url: _config.server + '/messages',
      loadingMsg: data.loadingMsg,
      data: {
        topic: MIRROR_TOPIC,
        timeout: data.expires,
        message: params
      },
      method: 'POST'
    }, 
    (res) => success && success(res), 
    (msg) => {
      _wx.wxShowDialog({
        message: msg,
        cbSuccess: () => {
          _route.last({
            pages: getCurrentPages(),
            data:"1"
          });
        }
      });
    }, () => {
      this.reqTask = null;
    });
  },

  // _releaseMirror() {
  //   let params = this.data.params;
  //   params.cmd = "3002";
  //   params['sender'] = DEVICE_TOPIC;
  //   params['data'] = {};
  //   _yunba.publish({
  //     topic: MIRROR_TOPIC,
  //     params: params,
  //   });
  // },

    // _initYunbaListener() {
  //   let that = this;
  //   app.messageListener = (args) => {
  //     let res = JSON.parse(args.msg);
  //     console.log("========== onReceiveMessage");
  //     console.log(res);
  //     if (res.cmd === '4000') {
  //       let hint = res.code === '401' ? "设备已被他人使用，请稍候办理。" : '出现了一个错误，请重试';
  //       _wx.wxShowDialog({
  //         message: hint,
  //         cbSuccess: () => {
  //           _route.last({
  //             pages: getCurrentPages()
  //           });
  //         }
  //       });
  //     } else if (res.cmd === '3021') {
  //       that._handleCheckinResult(res);
  //     }
  //   }
  // },

  _handleCheckinResult(res) {
    let that = this;
    let data = res.data.data;
    if (data.result_code == 0 || data.result_code == 3) { // 0 入住成功, 3 找到订单
      _route.next({
        pages: getCurrentPages()
      });
    } else {
      let fc = app.data.failureCount;
      let hint = that._mapFailHint(data.result_code);
      if (fc > 0) {
        app.data.checkinTimeStamp = new Date().getTime();
        fc--;
        app.data.failureCount = fc;
      }
      _wx.wxShowDialog({
        message: hint,
        cbSuccess: () => {
          _route.last({
            pages: getCurrentPages()
          });
        }
      });
    }
  },

  _mapFailHint(code) {
    let hint = '';
    switch (code) {
      case 1:
        hint = "对不起，验证失败，请您到前台找营业员继续办理"
        break;
      case 4:
        hint = "系统未查找到订单，请联系前台营业员办理"
        break;
      case 5:
        hint = "系统查找到多个与您同名的订单，请联系前台营业员办理"
        break;
      case -1:
        hint = "系统异常，请稍候重试"
        break;
      case 9:
        hint = "操作超时，请重新办理"
        break;
    }
    return hint;
  },

});