const app = getApp();
import * as _route from '../../routes/index';
import * as _utils_wx from '../../utils/wx';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';

Page({
  data: {
    invoiceData: [],
    navigationBarTitleAdd: '发票新增',
    navigationBarTitleEdit: '发票修改',
    isFetching: true
  },
  onLoad(opt) {},

  onShow() {
    this._invoiceInfo();
  },

  _invoiceInfo() {
    _wx.wxRequest({
      url: _config.server + '/invoices',
      method: 'GET'
    }, (res) => {
      let invoiceInfo = res.data.data;
      invoiceInfo.forEach((item) => {
        item['cn'] = this._mapTypeCN(item.type);
      });
      this.setData({
        invoiceData: invoiceInfo
      });
    }, null, () => {
      this.setData({
        isFetching: false
      });
    });
  },

  _mapTypeCN(key) {
    let cn = '';
    switch (key) {
      case 'PERSONAL':
        cn = "个人发票";
        break;
      case 'GENERAL':
        cn = "公司·增值税普通发票";
        break;
      case 'VAT':
        cn = "公司·增值税专用发票";
        break;
    }
    return cn;
  },

  _editInvoice(ev) {
    let idx = ev.currentTarget.dataset.index;
    const invoice = this.data.invoiceData[idx];
    app._saveInvoiceData(invoice);
    _route.last({
      pages: getCurrentPages(),
      data: {
        id: invoice.id
      }
    });
  },

  _addInvoice() {
    _route.next({
      pages: getCurrentPages()
    });
  },
});