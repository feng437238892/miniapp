import * as _wx from '../utils/wx.js';
import * as _utils from '../utils/util';
const app = getApp();

function next(params) {
  const route = params.currentRoute;
  const to = params.to;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'orderDetail':
      _wx.wxNavigateTo('../exitRoom/index' + query);
      break;
    case 'exitRoom':
      _wx.wxNavigateTo('../result/index' + query);
      break;
    case 'result':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      break;
    case 'addInvoice':
      // FIXME: 跳转发票申请成功页面
      _wx.wxBack();
      break;
    case 'selectRoom':
      _wx.wxBack();
      break;
    case 'selectPeople':
      _wx.wxBack();
      break;
    case 'addInvoice':
      _wx.wxBack();
      break;
      /*** 在confirmOrder && authentication的分支上 end ***/
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
  const to = params.to;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'home':
      if (to === 'introduction') {
        _wx.wxNavigateTo('../introduction/index' + query);
      } else if (to === 'register') {
        _wx.wxNavigateTo('../registerPhone/index' + query);
      }
      break;
    case 'orderDetail':
      let path = "";
      if (to === 'room') {
        path = '../selectRoom/index';
      } else if (to === 'people') {
        path = '../selectPeople/index';
      } else {
        path = '../addInvoice/index';
      }
      _wx.wxNavigateTo(path + query);
      break;
    case 'selectPeople':
      _wx.wxNavigateTo('../addPeople/index' + query);
      break;
  }
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}