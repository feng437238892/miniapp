import * as _utils from '../utils/util';

import * as checkin from './checkin';
import * as preCheckin from './preCheckin';
import * as service from './service';
import * as walkin from './walkin';
import * as checkout from './checkout';
import * as policePay from './policePay';

// 公共tab '我的'路由
import * as mine from './mine';
import * as _wx from '../utils/wx';

const app = getApp();
const mode = app.data.mode;

function next(params) {
  params['currentRoute'] = getCurrentPage(params.pages);
  if (getRootPage(params.pages) === 'mine') {
    mine.next(params);
    return;
  }
  if (getCurrentPage(params.pages) === 'registerPhone') {
    let query = '?' + _utils.objToString(params.data);
    _wx.wxNavigateTo('../registerVerify/index' + query);
    return;
  } else if (getCurrentPage(params.pages) === 'registerVerify') {
    _wx.wxRedirectTo('../crossroad/index?fromPage=register');
    return;
  }
  callback().next(params);
}

function last(params) {
  params['currentRoute'] = getCurrentPage(params.pages);
  if (getRootPage(params.pages) === 'mine') {
    mine.last(params);
    return;
  }
  callback().last(params);
}

function branch(params) {
  params['currentRoute'] = getCurrentPage(params.pages);
  if (getRootPage(params.pages) === 'mine') {
    mine.branch(params);
    return;
  }
  callback().branch(params);
}

function callback() {
  const mode = app.data.mode;
  let cb = null;

  if (mode === 'checkin') {
    cb = checkin;
  } else if (mode === 'pre-checkin') {
    cb = preCheckin;
  } else if (mode === 'service') {
    cb = service;
  } else if (mode === 'walkin') {
    cb = walkin;
  } else if (mode === 'checkout') {
    cb = checkout;
  } else if (mode === 'police-pay') {
    cb = policePay;
  } else {
    // do sth
  }
  return cb;
}

function getCurrentPage(pages) {
  return _utils.getRouteMini(pages[pages.length - 1]);
}

function getRootPage(pages) {
  return _utils.getRouteMini(pages[0]);
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}