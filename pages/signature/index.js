import _wx from '../../utils/wx.js';
import * as _route from '../../routes/index';
const app = getApp();

Page({
  data: {
    showHint: true
  },

  onLoad: function(options) {

  },

  onReady: function() {
    this._context = _wx.wxCreateCanvasContext('signature');
  },

  _bindtouchstart(ev) {
    this.setData({
      showHint: false
    });
    this.startX = ev.touches[0].x;
    this.startY = ev.touches[0].y;
    this._context.moveTo(ev.touches[0].x, ev.touches[0].y);
    this._context.setLineCap('round');
    this._context.setLineJoin('round');
  },

  _bindtouchmove(ev) {
    this._context.moveTo(this.startX, this.startY)
    this._context.lineTo(ev.touches[0].x, ev.touches[0].y);
    this.startX = ev.touches[0].x;
    this.startY = ev.touches[0].y;
    this._context.setLineWidth(3);
    this._context.stroke();
    this._context.draw(true);
  },

  _binderror(ev) {},

  _save() {
    let order = app.currentOrder;
    order.flow.is_paid = true;
    order.flow.is_signed = true;
    app._setCurrentOrder(order);

    _route.next({
      pages: getCurrentPages()
    });
  },

  _clear() {
    this._context.draw(false);
    this.setData({
      showHint: true
    });
  }
})