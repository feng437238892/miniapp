const app = getApp();
import * as _route from '../../routes/index';
import * as _wx from '../../utils/wx';
import * as _config from '../../utils/config';
import * as _utils from '../../utils/util';

Page({
  data: {
    isSelectCond: false,
    count: 0,
    originRooms: [],
    rooms: [],
    conditions: [],
    index: 0,
    filters: [],
    tempFilters: [],
    canSave: false,
    mode: ''
  },

  onLoad(opt) {
    this._fetchRooms(opt);
    this._fetchConditions();
  },

  _fetchConditions() {
    let order = app.currentOrder;
    let that = this;
    _wx.wxRequest({
      url: _config.server + '/rooms/preference',
      data: {
        hotel_id: app.currentOrder.hotel.hotel_id || ''
      }
    }, (res) => {
      console.log(res.data.data);
      that.setData({
        conditions: res.data.data.room_preference || []
      });
    });
  },

  _fetchRooms(opt) {
    let {
      subid,
      id,
      number
    } = opt;
    let that = this;
    let order = app.currentOrder;
    let currentSuborder = app._getCurrentSuborder(subid);
    let scene = app.scene;
    let filter = 'TODO';
    if (scene.name === 'main' && scene.device_id) {
      filter = 'CHECKIN';
    }
    _wx.wxRequest({
        url: _config.server + '/rooms',
        data: {
          hotel_id: id,
          room_type_id: currentSuborder.room_type_pmsid,
          in_time: order.in_time,
          out_time: order.out_time,
          white_ids: [currentSuborder.room_number],
          filter: filter
        },
        method: 'POST'
      }, (res) => {
        let rooms = res.data.data;
        let canSave = false;
        let index = 0;
        rooms.forEach((room, i) => {
          room['checked'] = room.room_number === number;
          if (room.checked) {
            canSave = true;
            index = i;
          }
        });
        that.setData({
          whiteRoomNumber: number,
          originRooms: rooms,
          rooms: rooms,
          subid: subid,
          canSave: canSave,
          mode: app.data.mode,
          index: index
        });
      })
      // this.setData({
      //   rooms: this.data.originRooms
      // });
  },

  _selectRoom(ev) {
    const index = ev.currentTarget.dataset.index;
    let rooms = this.data.rooms;
    rooms.forEach((room) => {
      room['checked'] = false;
    });
    rooms[index].checked = true;
    this.setData({
      rooms: rooms,
      index: index,
      canSave: true
    });
  },

  _selectCond(ev) {
    const index = ev.currentTarget.dataset.index;
    let conditions = this.data.conditions;
    conditions[index]['checked'] = !conditions[index]['checked'];
    let values = [];
    conditions.forEach((item) => {
      if (item.checked) {
        values.push(item.item_desc);
      }
    });
    this.setData({
      conditions: conditions,
      tempFilters: values
    });
  },

  _openFilter() {
    this.setData({
      isSelectCond: true,
    });
  },

  _closeFilter() {
    this.setData({
      tempFilters: [],
      isSelectCond: false,
    });
  },

  _confirmFilter() {
    let tempFilters = this.data.tempFilters;
    this._filterRooms(tempFilters);

    this.setData({
      isSelectCond: false,
      filters: tempFilters,
      count: tempFilters.length
    });
  },

  _filterRooms(filters) {
    let rooms = this.data.originRooms;
    if (filters.length <= 0) {
      this.setData({
        rooms: rooms
      });
      return;
    }
    let newRooms = [];
    rooms.forEach((room) => {
      let flag = false;
      if (room.tags && (room.tags.length >= filters.length)) {
        for (let i = 0; i < filters.length; i++) {
          let filter = filters[i];
          if (!room.tags.includes(filter)) {
            flag = false;
            break;
          }
          flag = true;
        }
      }
      if (flag) newRooms.push(room);
    });
    let index = newRooms.findIndex((item) => {
      return item.checked;
    });
    let canSave = true;
    if (index < 0 && newRooms.length > 0) {
      canSave = false;
      // index = 0;
      // newRooms[0].checked = true;
    }
    this.setData({
      index: index,
      rooms: newRooms,
      canSave: canSave
    });
  },

  _confirm() {
    const {
      whiteRoomNumber,
      rooms,
      index,
      subid
    } = this.data;
    const targetRoom = rooms[index];
    let suborder = app._getCurrentSuborder(subid);
    suborder['tags'] = targetRoom.tags;
    suborder['room_number'] = targetRoom.room_number;
    if (whiteRoomNumber == targetRoom.room_number) {
      _route.next({
        pages: getCurrentPages()
      });
    } else {
      this._updateRooms(suborder, targetRoom.room_number);
    }
  },

  _updateRooms(suborder, number) {
    _wx.wxRequest({
      url: _config.server + `/suborders/${suborder.suborder_id}`,
      data: {
        room_number: number
      },
      method: 'PUT'
    }, (res) => {
      app._updateSuborder(suborder);
      _route.next({
        pages: getCurrentPages()
      });
    });
  }

});