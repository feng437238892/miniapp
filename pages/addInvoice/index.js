const app = getApp();
import * as _route from '../../routes/index';
import * as _utils from '../../utils/util';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';

Page({
  data: {
    typeRange: [{
      id: 0,
      cn: '请选择',
    }, {
      id: 'PERSONAL',
      cn: '个人发票',
    }, {
      id: 'GENERAL',
      cn: '公司·增值税普通发票',
    }, {
      id: 'VAT',
      cn: '公司·增值税专用发票',
    }],
    mediaRange: [{
        id: 'PAPER',
        cn: '纸质发票'
      }
      // , {
      //   id: 'EINVOICE',
      //   cn: '电子发票'
      // }
    ],
    categoryRange: [],
    categoryValue: 0,
    mediaValue: 0,
    typeValue: 0,
    invoiceData: {
      type: '',
      media: 'PAPER',
      category: '',
      title: '',
      tax_registry_no: '',
      address: '',
      phone_number: '',
      bank_name: '',
      bank_account: ''
    },
    isEdit: false,
    showVatInput: false,
    canDoNext: false,
    originList: [],
    showList: [],
    showToast: false,
    mode: ''
  },

  onLoad(opt) {
    this._fetchInvoiceCategory(opt);
    this.setData({
      mode: app.data.mode
    });
  },

  _fetchInvoiceCategory(opt) {
    if (app.data.mode == 'mine') {
      this._initData(opt.id || '');
      return;
    }
    let order = app.currentOrder;
    let that = this;
    _wx.wxRequest({
      url: _config.server + '/invoices/categories/' + app.currentOrder.hotel.hotel_id,
    }, (res) => {
      that.setData({
        categoryRange: res.data.data
      });
    }, null, () => {
      that._initData(opt.id || '');
    });
  },

  // FIXME: 接口修改
  _initData(id) {
    let path = '',
      method = '',
      categoryIndex = 0,
      mediaIndex = 0,
      typeIndex = 0;
    let {
      invoiceData,
      isEdit,
      mediaRange,
      typeRange,
      categoryRange
    } = this.data;
    isEdit = app.data.mode !== 'mine' ? !_utils.isEmpty(app.currentOrder.invoice) : id.length > 0;
    if (isEdit) {
      _wx.wxSetNavigationBarTitle('修改发票');
      // 传过来一个发票的id
      invoiceData = id.length > 0 ? app.invoiceData : app.currentOrder.invoice;
      mediaIndex = mediaRange.findIndex((item) => {
        return item.id == invoiceData.media;
      });
      typeIndex = typeRange.findIndex((item) => {
        return item.id == invoiceData.type;
      });
      categoryIndex = categoryRange.findIndex((item) => {
        return item.item_desc == invoiceData.category;
      });
    }
    console.log(app.data.mode);
    if (app.data.mode !== 'mine') {
      this._fecthInvoiceList();
      if (isEdit) {
        method = 'PUT';
        path = `/orders/${app.currentOrder.order_id}/invoices/${invoiceData.id}`;
      } else {
        method = 'POST';
        path = `/orders/${app.currentOrder.order_id}/invoices`;
      }
    } else {
      if (isEdit) {
        method = 'PUT';
        path = `/invoices/${id}`;
      } else {
        method = 'POST';
        path = '/invoices';
      }
    }
    this.setData({
      confirmParams: {
        method: method,
        url: _config.server + path
      },
      isEdit: isEdit,
      invoiceData: invoiceData,
      mediaValue: mediaIndex,
      typeValue: typeIndex,
      categoryValue: categoryIndex,
      showVatInput: parseInt(typeIndex) === 3
    });
  },

  _bindPickerChange(ev) {
    const type = ev.currentTarget.dataset.type;
    const value = ev.currentTarget.dataset.value;
    const index = ev.detail.value;
    let data = this.data;
    let invoiceData = this.data.invoiceData;
    data[value] = index;
    if (value === 'mediaRange' && parseInt(index) === 0) {
      invoiceData[type] = data[`${type}Range`][index].id;
    }
    if (parseInt(index) > 0) {
      console.log(data[`${type}Range`]);
      console.log(index);
      invoiceData[type] = data[`${type}Range`][index].id;
    }

    if (type === 'category') {
      invoiceData[type] = data['categoryRange'][index].item_desc;
    }
    // 当滑动开票类型的picker时进行弹窗操作
    if (type === 'type' && parseInt(index) > 0) {
      this._judgeWhichList(data[`${type}Range`][index].id);
      data['showVatInput'] = parseInt(index) === 3;
      invoiceData.title = '';
      invoiceData.tax_registry_no = '';
      invoiceData.address = '';
      invoiceData.phone_number = '';
      invoiceData.bank_name = '';
      invoiceData.bank_account = '';
    }

    data['invoiceData'] = invoiceData;

    this.setData(data);

    this._canDoNext(invoiceData);
  },

  _bindInputChange(ev) {
    const type = ev.currentTarget.dataset.type;
    let invoiceData = this.data.invoiceData;
    invoiceData[type] = ev.detail.value;
    this._canDoNext(invoiceData);
    this.setData({
      invoiceData: invoiceData
    });
  },

  _canDoNext(invoiceData) {
    let canDoNext = false;
    const {
      type,
      media,
      category,
      title,
      tax_registry_no,
      address,
      phone_number,
      bank_name,
      bank_account
    } = invoiceData;
    if (parseInt(this.data.typeValue) === 3) {
      canDoNext = type.length > 0 &&
        media.length > 0 &&
        title.length > 0 &&
        (tax_registry_no && tax_registry_no.length > 0) &&
        (address && address.length > 0) &&
        (phone_number && phone_number.length > 0) &&
        (bank_name && bank_name.length > 0) &&
        (bank_account && bank_account.length) > 0;
    } else if (parseInt(this.data.typeValue) === 2) {
      canDoNext = type.length > 0 &&
        media.length > 0 &&
        title.length > 0 &&
        (tax_registry_no && tax_registry_no.length > 0);
    } else {
      canDoNext = type.length > 0 &&
        media.length > 0 &&
        title.length > 0;
    }
    if (this.data.mode != 'mine') {
      canDoNext = canDoNext && category.length > 0;
    }
    this.setData({
      canDoNext: canDoNext
    });
  },

  _fecthInvoiceList() {
    _wx.wxRequest({
      url: _config.server + '/invoices',
      method: 'GET'
    }, (res) => {
      this.setData({
        originList: res.data.data
      });
    });
  },

  _judgeWhichList(key) {
    const originList = this.data.originList;
    let showList = [];
    originList.forEach((item) => {
      item['type_cn'] = this._mapTypeCN(item.type);
      if (item.type === key) {
        showList.push(item);
      }
    });
    this.setData({
      showList: showList,
      showToast: showList.length > 0
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

  _selectInvoice(ev) {
    const index = ev.currentTarget.dataset.index;
    let showList = this.data.showList;
    showList.forEach((item) => {
      item['checked'] = false;
    });
    let invoiceData = showList[index];
    invoiceData['checked'] = true;
    invoiceData['category'] = '';
    const mediaIndex = this.data.mediaRange.findIndex((item) => {
      return item.id === invoiceData.media;
    });
    this._canDoNext(invoiceData);
    this.setData({
      invoiceData: invoiceData,
      showToast: false,
      mediaValue: mediaIndex,
      categoryValue: 0
    });
  },

  _confirm() {
    const invoiceData = this.data.invoiceData;
    const confirmParams = this.data.confirmParams;
    confirmParams['data'] = invoiceData;
    _wx.wxRequest(confirmParams, (res) => {
      if (app.data.mode !== 'mine') {
        let order = app.currentOrder;
        order['invoice'] = invoiceData;
        order['hasInvoice'] = true;
        app._setCurrentOrder(order);
      }
      _route.next({
        pages: getCurrentPages()
      });
    });
  },

  _back() {
    _route.last({
      pages: getCurrentPages()
    });
  },

  _delete() {
    const invoiceData = this.data.invoiceData;
    let path = `/invoices/${invoiceData.id}`;
    if (app.data.mode !== 'mine') {
      let order = app.currentOrder;
      path = `/orders/${order.order_id}/invoices/${invoiceData.id}`;
      order.invoice = null;
      app._setCurrentOrder(order);
    }
    _wx.wxRequest({
      url: _config.server + path,
      method: 'DELETE'
    }, (res) => {
      let order = app.currentOrder;
      order['invoice'] = {};
      order['hasInvoice'] = false;
      app._setCurrentOrder(order);
      _route.last({
        pages: getCurrentPages()
      });
    });
  },

  _close() {
    this.setData({
      showToast: false
    });
  }

});