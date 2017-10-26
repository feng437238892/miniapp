import * as _wx from '../utils/wx.js';
import * as _utils from '../utils/util';
const app = getApp();

function next(params) {
  const route = params.currentRoute;
  const to = params.to;
  const pages = params.pages;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'confirmOrder':
      _wx.wxNavigateTo('../pay/index' + query);
      break;
    case 'pay':
      if (app.currentOrder.config.enabled_sign) {
        _wx.wxRedirectTo('../signature/index' + query);
      } else {
        _wx.wxBack(1);
      }
      break;
    case 'signature':
      break;
    case 'authentication':
      _wx.wxNavigateTo('../mirror/index' + query);
      break;
    case 'mirror':
      _wx.wxRedirectTo('../result/index' + query);
      break;
    case 'result':
      app.data.checkinTimeStamp = new Date().getTime();
      _wx.wxBack(pages.length - 2);
      break;
      /*** 在confirmOrder && authentication的分支上 start ***/
    case 'selectRoom':
      _wx.wxBack();
      break;
    case 'selectPeople':
      if (_utils.getRouteMini(pages[pages.length - 2]) === 'authentication') {
        _wx.wxRedirectTo('../mirror/index' + query);
      } else {
        _wx.wxBack();
      }
      break;
    case 'addPeople':
      _wx.wxBack();
      break;
    case 'addInvoice':
      // FIXME: 跳转发票申请成功页面
      if (app.currentOrder.flow.is_pre_checkin) {
        _wx.wxBack();
      } else {
        _wx.wxRedirectTo('../result/index?fromPage=invoice');
      }
      break;
      /*** 在confirmOrder && authentication的分支上 end ***/
  }
}

function last(params) {
  const route = params.currentRoute;
  const pages = params.pages;
  const to = params.to;
  switch (route) {
    case 'confirmOrder':
      _wx.wxSwitchTab('../home/index');
      break;
    case 'mirror':
      if (to === 'home') {
        _wx.wxSwitchTab('../home/index');
      } else {
        let n = 2;
        if (_utils.getRouteMini(pages[pages.length - 2]) === 'selectPeople') {
          n = 3;
        }
        _wx.wxBack(n);
      }
      break;
    case 'result':
      _wx.wxSwitchTab('../home/index');
      break;
    case 'addPeople':
      _wx.wxBack();
      break;
    case 'addInvoice':
      _wx.wxBack();
      break;
    case 'authentication':
      _wx.wxSwitchTab('../home/index');
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
  let path = '';
  let method = 'n';
  switch (route) {
    case 'confirmOrder':
      // FIXME: 需要传参
      if (to === 'room') {
        path = '../selectRoom/index';
      } else if (to === 'people') {
        path = '../selectPeople/index';
      } else if (to === 'checkin') {
        const suborder = app._getCurrentSuborder();
        path = suborder.guests && suborder.guests.length > 0 ? '../mirror/index' : '../authentication/index';
      } else if (to === 'invoice') {
        path = '../addInvoice/index';
      }
      break;
    case 'selectPeople':
      path = '../addPeople/index';
      break;
    case 'authentication':
      // FIXME: 未带身份证
      path = '../selectPeople/index';
      break;
    case 'result':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      return;
  }
  _wx.wxNavigateTo(path + query);
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}