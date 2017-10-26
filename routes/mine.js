import * as _wx from '../utils/wx.js';
import * as _utils from '../utils/util';

function next(params) {
  const route = params.currentRoute;
  const to = params.to;
  let query = '';
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'minePhone':
      _wx.wxNavigateTo('../registerPhone/index' + query);
      break;
    case 'registerPhone':
      _wx.wxNavigateTo('../registerVerify/index' + query);
      break;
    case 'registerVerify':
      _wx.wxBack(2);
      break;
    case 'peopleList':
      _wx.wxNavigateTo('../addPeople/index' + query);
      break;
    case 'addPeople':
      _wx.wxBack(1);
      break;
    case 'invoiceList':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      break;
    case 'addInvoice':
      _wx.wxBack(1);
      break;

    case 'historyOrderList':
      _wx.wxNavigateTo('../historyOrderDetail/index' + query);
      break;
    case 'wifi':
      _wx.wxBack(1);
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
    case 'invoiceList':
      _wx.wxNavigateTo('../addInvoice/index' + query);
      break;
    case 'addInvoice':
      _wx.wxBack(1);
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
    case 'mine':
      mineBranch(params);
      break;
    case 'peopleList':
      _wx.wxNavigateTo('../addPeople/index' + query);
      break;
    case 'services':
      servicesBranch(params);
      break;
  }
}

function mineBranch(params) {
  let query = '';
  const to = params.to;
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (to) {
    case 'minephone':
      // TODO: minephone
      _wx.wxNavigateTo('../minePhone/index' + query);
      break;
    case 'people':
      // TODO: peopleList
      _wx.wxNavigateTo('../peopleList/index' + query);
      break;
    case 'invoice':
      // TODO: invoice list
      _wx.wxNavigateTo('../invoiceList/index' + query);
      break;
    case 'orders':
      // TODO: orders list
      _wx.wxNavigateTo('../historyOrderList/index' + query);
      break;
    case 'help':
      // TODO: help page
      break;
  }
}

function servicesBranch(params) {
  let query = '';
  const to = params.to;
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (to) {
    case 'wifi':
      // TODO: wifi
      _wx.wxNavigateTo('../wifi/index' + query);
      break;
  }
}

module.exports = {
  next: next,
  last: last,
  branch: branch
}