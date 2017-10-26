import * as _wx from '../utils/wx.js';
import * as _utils from '../utils/util';
const app = getApp();

/**
 * pre-checkin路由
 */

// 主路径
function next(params) {
  const route = params.currentRoute;
  const order = app.currentOrder;
  let query = '';
  const to = params.to;;
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'assignRooms':
      if (to == 'pay') {
        _wx.wxNavigateTo('../pay/index' + query);
      } else {
        let path = (app.currentOrder.config.enabled_sign && order.flow.is_paid) ?
          '../signature/index' : '../result/index';
        _wx.wxRedirectTo(path + query);
      }
      break;
    case 'pay':
      let path = (app.currentOrder.config.enabled_sign && order.flow.is_paid) ?
        '../signature/index' : '../result/index';
      _wx.wxRedirectTo(path + query);
      break;
    case 'signature':
      _wx.wxRedirectTo('../result/index' + query);
      break;
    case 'result':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      break;
    case 'addInvoice':
      // FIXME: 跳转发票申请成功页面
      if (app.currentOrder.flow.is_pre_checkin || app.currentOrder.status == 4) {
        _wx.wxBack();
      } else {
        _wx.wxRedirectTo('../result/index?fromPage=invoice');
      }
      break;
    case 'selectRoom':
      _wx.wxBack();
      break;
    case 'selectPeople':
      _wx.wxBack();
      break;
    case 'addPeople':
      _wx.wxBack();
      break;
    case 'orderDetail':
      _wx.wxNavigateTo('../pay/index' + query);
      break;
  }
}

function last(params) {
  const route = params.currentRoute;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'result':
      _wx.wxSwitchTab('../home/index' + query);
      break;
    case 'addInvoice':
      _wx.wxBack();
      break;
    case 'addPeople':
      _wx.wxBack();
      break;
  }
}

function branch(params) {
  const route = params.currentRoute;
  const to = params.to;;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'assignRooms':
      if (to === 'room') {
        _wx.wxNavigateTo('../selectRoom/index' + query);
      } else if (to === 'people') {
        _wx.wxNavigateTo('../selectPeople/index' + query);
      }
      break;
    case 'orderDetail':
      if (to === 'room') {
        _wx.wxNavigateTo('../selectRoom/index' + query);
      } else if (to === 'people') {
        _wx.wxNavigateTo('../selectPeople/index' + query);
      } else if (to === 'invoice') {
        _wx.wxNavigateTo('../addInvoice/index' + query);
      }
      break;
    case 'selectPeople':
      _wx.wxNavigateTo('../addPeople/index' + query);
      break;
    case 'pay':
      _wx.wxRedirectTo('../result/index' + query);
      break;
  }
}


module.exports = {
  next: next,
  last: last,
  branch: branch
}