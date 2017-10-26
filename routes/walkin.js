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
    case 'walkinHome':
      _wx.wxNavigateTo('../walkinOrderList/index');
      break;
    case 'walkinOrderList':
      _wx.wxNavigateTo('../walkinOrderDetail/index');
      break;
    case 'walkinOrderList':
      _wx.wxSwitchTab('../home/index');
      break;
    case 'walkinAuth':
      // _wx.wxRedirectTo('../station/index' + query);
      _wx.wxSwitchTab('../home/index');
      break;
    case 'mirror':
      _wx.wxSwitchTab('../home/index');
      break;
  }
}

function last(params) {
  const route = params.currentRoute;
  const to = params.to;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'mirror':
      _wx.wxBack();
      break;
  }
}

function branch(params) {
  const route = params.currentRoute;
  const to = params.to;
  switch (route) {
    case 'walkinHome':
      if (to == 'code') {
        _wx.wxNavigateTo('../walkinAuth/index');
      } else {
        _wx.wxNavigateTo('../mirror/index');
      }
      break;
  }
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}