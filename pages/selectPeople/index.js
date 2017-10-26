const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

let isFetching = false;

Page({
  data: {
    canNext: false,
    people: [],
    selectPeole: [],
    suborder: {},
    canEmpty: false,
    maxCount: 0
  },

  onLoad(opt) {
    const suborder = app._getCurrentSuborder(opt.subid);
    let canEmpty = false;
    // TODO: 判断那一页过来的
    if (opt.subid) {
      _wx.wxSetNavigationBarTitle(suborder.room_number + '身份信息');
      canEmpty = true;
    }
    this.setData({
      suborder: suborder,
      canEmpty: canEmpty,
      maxCount: suborder.max_guests_count || 2
    });
    this._fetchContacts((people) => {
      if (people.length <= 0) {
        this.isFetching = false;
        _route.branch({
          pages: getCurrentPages()
        });
      }
    });
  },

  onShow() {
    console.log(this.isFetching);
    if (!this.isFetching) {
      this._fetchContacts();
    }
  },

  _fetchContacts(cb) {
    this.isFetching = true;
    let that = this;
    let mode = app.data.mode;
    let params = {
      filter: mode,
      hotel_id: app.currentOrder.hotel.hotel_id
    }
    _wx.wxRequest({
      url: _config.server + '/guestsList',
      data: params,
      method: 'POST'
    }, (res) => {
      let people = res.data.data;
      let guests = that.data.suborder.guests || [];
      people.forEach((person) => {
        const index = guests.findIndex((item) => {
          return ('' + item.idcard) === ('' + person.idcard);
        });
        person['checked'] = index > -1;
      });
      const data = that._processData(people);
      typeof cb === 'function' && cb(people);
      that.setData({
        people: people,
        canNext: data.canNext,
        selectPeole: data.selectPeole
      });
    }, null, () => {
      this.isFetching = false;
    });
  },

  _bindCheckboxChange(ev) {
    const people = this.data.people;
    const values = ev.detail.value;
    people.forEach((person) => {
      person['checked'] = values.includes(person.idcard);
    });
    const data = this._processData(people);
    this.setData({
      people: people,
      canNext: data.canNext,
      selectPeole: data.selectPeole
    });
  },

  _selectPeople(ev) {
    let people = this.data.people;
    const index = ev.currentTarget.dataset.index;
    let maxCount = this.data.maxCount;
    if (!people[index]['checked'] && this.data.selectPeole.length >= maxCount) {
      _wx.wxShowDialog({
        message: `该房间至多可入住${maxCount}人`
      });
      return;
    }

    people[index]['checked'] = !people[index]['checked'];
    const data = this._processData(people);
    this.setData({
      people: people,
      canNext: data.canNext,
      selectPeole: data.selectPeole
    });
  },

  _next() {
    let that = this;
    let {
      suborder,
      selectPeole,
      canEmpty
    } = this.data;
    suborder.guests = null;
    suborder.guests = selectPeole;
    if (!canEmpty) {
      let index = suborder.guests && suborder.guests.findIndex((item) => {
        return !_utils.checkID(item.idcard);
      });
      if (null != index && index >= 0) {
        _wx.wxShowDialog({
          message: "您的入住人信息含有非身份证证件号码。如果您的证件为身份证，请您确认是否输入错误。如果您是非身份证证件办理入住，请您到前台找营业员办理。",
        });
        return;
      }
      let hasDirtyRoom = suborder.room_status_id == 2;
      if (hasDirtyRoom) {
        let hint = suborder.clean_count && suborder.clean_count > 0 ?
          `您的房间${suborder.room_number}尚未打扫，但我们有其他干净房间可选择，您可以选择更换房间。也可以稍等片刻，我们安排人员为您打扫。点击\'取消\'更换房间，点击\'好的\'继续办理入住。` :
          `您的房间${suborder.room_number}尚未打扫，请您等待片刻，我们安排人员为您打扫。是否选择继续办理入住?`;
        _wx.wxShowDialog({
          message: hint,
          showCancel: true,
          cbSuccess: () => {
            this._updateGuests(suborder, selectPeole);
          }
        });
        return;
      }
    }
    this._updateGuests(suborder, selectPeole);
  },

  _updateGuests(suborder, selectPeole) {
    _wx.wxRequest({
      url: _config.server + `/suborders/${suborder.suborder_id}/guests`,
      method: 'PUT',
      data: {
        guests: selectPeole
      }
    }, (res) => {
      app._updateSuborder(suborder);
      _route.next({
        pages: getCurrentPages(),
        data: {
          count: selectPeole.length
        }
      });
    });
  },

  _addPeople() {
    _route.branch({
      pages: getCurrentPages()
    });
  },

  _processData(people) {
    let selectPeole = [];
    for (let i = 0; i < people.length; i++) {
      let person = people[i];
      if (person.checked) {
        selectPeole.push({
          name: person.name,
          idcard: person.idcard
        });
      }
    }
    return {
      canNext: selectPeole.length > 0,
      selectPeole: selectPeole
    }
  }
});