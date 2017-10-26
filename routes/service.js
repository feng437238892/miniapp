import * as _wx from '../utils/wx.js';

function next(params) {
  const route = params.currentRoute;
  const to = params.to;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'wifi':
      _wx.wxBack(1);
      break;
  }
}

function last(params) {
  const route = params.currentRoute;
  const to = params.to;
}

function branch(params) {
  const route = params.currentRoute;
  const to = params.to;
  let path = '';
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (to) {
    case 'wifi':
      _wx.wxNavigateTo('../wifi/index');
      break;
    case 'invoice':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      break;
    case 'roomService':
      break;
    case 'checkout':
      _wx.wxNavigateTo('../exitRoom/index' + query);
      break;
  }
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}