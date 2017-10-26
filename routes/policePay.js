import * as _wx from '../utils/wx.js';
import * as _utils from '../utils/util';
const app = getApp();

function next(params) {
  const route = params.currentRoute;
  const order = app.currentOrder;
  let query = '';
  const to = params.to;;
  if (params.data) {
    query = '?' + _utils.objToString(params.data);
  }
  switch (route) {
    case 'pay':
      _wx.wxSwitchTab('../home/index' + query);
      break;
  }
}

function last(params) {
  
}

function branch(params) {
  
}


module.exports = {
  next: next,
  last: last,
  branch: branch
}