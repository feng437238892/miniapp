import _config from './config';
import _utils from './util';

function wxCheckSession(cbSuccess, cbFail) {
  wx.checkSession({
    success: function() {
      cbSuccess ? cbSuccess() : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    }
  })
}

function wxSetStorage(key, data, cbSuccess, cbFail) {
  wx.setStorage({
    key: key,
    data: data,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {}
  })
}

function wxGetStorage(key, cbSuccess, cbFail) {
  wx.getStorage({
    key: key,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {}
  })
}

function wxGetUserInfo(cbSuccess, cbFail) {
  wx.getUserInfo({
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {}
  })
}

/* 
 *  params: {
 *    url: '',              // 请求api
 *    data: {},             // 请求参数
 *    method: {},           // 请求方法
 *    isShowLoading: false, // 是否显示请求动画
 *  }
 */
function wxRequest(params, cbSuccess, cbFail, cbComplete) {
  const session = getApp().data.session || null;

  // console.log('=================wxRequest showToast=================');
  console.log(params);
  // console.log(session);
  if (!params.hideStartLoading) {
    this.wxShowLoading(params.loadingMsg);
  }

  let that = this;
  let reqTask = wx.request({
    url: params.url,
    data: params.data,
    method: params.method || 'GET',
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Session': session
    },
    success: function(res) {
      console.log(res);
      if (parseInt(res.statusCode) === 401) {
        that.wxLogin(params, cbSuccess, cbFail);
        return;
      }
      if (parseInt(res.statusCode) !== 200 || (res.data && parseInt(res.data.errcode) !== 0)){
        if (typeof cbFail === 'function') {
          cbFail(res.data ? res.data.errmsg : '网络异常，请稍后再试');
        } else {
          that.wxShowDialog({
            message: res.data.errmsg
          });
        }
      } else {
        typeof cbSuccess === 'function' && cbSuccess(res);
      }
    },
    fail: function(error) {
      // console.log('wx request error:');
      // console.log(error);
      that.wxHideLoading();
      typeof cbFail === 'function' && cbFail(error);
    },
    complete: function() {
      that.wxHideLoading();
      typeof cbComplete === 'function' && cbComplete();
    }
  });
  return reqTask;
}

function wxDownloadFile(url, cbSuccess, cbFail) {
  wx.downloadFile({
    url: url, //仅为示例，并非真实的资源
    success: function(res) {
      // console.log('wx download file success');
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      // console.log('wx download file error:');
      console.log(error);
      cbFails ? cbFail() : null;
    },
    complete: function() {
      // console.log("wx download file complete");
    }
  })
}

function wxOpenDocument(filePath, cbSuccess, cbFail) {
  wx.openDocument({
    filePath: filePath,
    success: function(res) {
      // console.log('wx open document success');
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      // console.log('wx open document error:');
      // console.log(error);
      cbFail ? cbFail() : null;
    },
    complete: function() {
      // console.log("wx open document complete");
    }
  })
}

function wxSetNavigationBarTitle(title, cbSuccess, cbFail) {
  wx.setNavigationBarTitle({
    title: title,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {}
  })
}

function wxNavigateTo(url, cbSuccess, cbFail, cbComplete) {
  wx.navigateTo({
    url: url,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {
      cbComplete ? cbComplete() : null;
    }
  })
}

function wxRedirectTo(url, cbSuccess, cbFail, cbComplete) {
  wx.redirectTo({
    url: url,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {
      cbComplete ? cbComplete() : null;
    }
  })
}

function wxSwitchTab(url, cbSuccess, cbFail, cbComplete) {
  wx.switchTab({
    url: url,
    success: function(res) {
      cbSuccess ? cbSuccess(res) : null;
    },
    fail: function(error) {
      cbFail ? cbFail() : null;
    },
    complete: function() {
      cbComplete ? cbComplete() : null;
    }
  });
}

function wxShowDialog(params) {
  let {
    title,
    message,
    cbSuccess,
    cbCancel,
    showCancel,
  } = params;
  wx.showModal({
    title: title || '提示',
    content: message || '请稍候重试',
    confirmText: '好的',
    cancelText: '取消',
    showCancel: showCancel || false,
    success: (res) => {
      let cb = res.confirm ? cbSuccess : cbCancel;
      typeof cb === 'function' && cb();
    },
  });
}

function wxShowLoading(msg) {
  if (wx.canIUse && wx.canIUse('showLoading')) {
    wx.showLoading({
      title: msg || '请稍候...',
      mask: true
    })
  } else {
    wx.showToast({
      icon: 'loading',
      title: msg || '请稍候...',
      mask: true
    });
  }

}

function wxHideLoading() {
  if (wx.canIUse && wx.canIUse('showLoading')) {
    wx.hideLoading();
    wx.hideToast();
  } else {
    wx.hideToast();
  }
}

function wxBack(n = 1) {
  wx.navigateBack({
    delta: n
  });
}

function wxCreateCanvasContext(name) {
  return wx.createCanvasContext(name);
}

function wxCanvasToTempFilePath(id, cbSuccess, cbFail, cbComplete) {
  wx.canvasToTempFilePath({
    canvasId: id,
    success: (res) => {
      typeof cbSuccess === 'function' && cbSuccess();
    },
    fail: (res) => {
      typeof cbFail === 'function' && cbFail();
    },
    complete: (res) => {
      typeof cbComplete === 'function' && cbComplete();
    }
  });
}

function wxOpenMap(params, cbSuccess, cbFail, cbComplete) {
  wx.openLocation({
    latitude: params.lat,
    longitude: params.lng,
    scale: params.scale || 18,
    name: params.name,
    address: params.address,
    success: (res) => {
      typeof cbSuccess === 'function' && cbSuccess();
    },
    fail: (res) => {
      typeof cbFail === 'function' && cbFail();
    },
    complete: (res) => {
      typeof cbComplete === 'function' && cbComplete();
    }
  });
}

function wxSetNavigationBarTitle(title) {
  wx.setNavigationBarTitle({
    title: title
  });
}

function wxMakePhoneCall(number) {
  wx.makePhoneCall({
    phoneNumber: number,
  });
}

/**
 * 请求返回401的接口，在重新登录后再次请求
 */
function wxLogin(params, cbSuccess, cbFail, cbComplete) {
  wx.login({
    success: (res) => {
      let code = res.code;
      console.log('code', code);
      this.wxRequest({
        url: _config.server + '/auth/login',
        data: {
          code: code,
          app_id: _config.appid
        }
      }, (res) => {
        getApp().data.session = res.data.data.session_id;
        getApp().data.userId = res.data.data.user_id;
        console.log('session_id', res.data.data.session_id);
        console.log('user_id', res.data.data.user_id);
        if (params.needPhoneBind && !res.data.data.is_mobile_bound) {
          setTimeout(() => {
            this.wxRedirectTo('../registerPhone/index');
          }, 1000);
          return;
        }

        delete params.needPhoneBind;

        // 重新登录
        if (!_utils.isEmpty(params)) {
          console.log('========request again: ' + params.url);
          this.wxRequest(params, cbSuccess, cbFail);
        }

        typeof cbComplete === 'function' && cbComplete(res.data.data.session_id);
      });
    }
  });
}

function wxPay(params, cbSuccess, cbFail, cbComplete) {
  wx.requestPayment({
    timeStamp: params.timeStamp,
    nonceStr: params.nonceStr,
    package: params.package,
    signType: params.signType,
    paySign: params.paySign,
    success: (res) => {
      typeof cbSuccess === 'function' && cbSuccess(res);
    },
    fail: (msg) => {
      typeof cbFail === 'function' && cbFail(msg);
    },
    complete: (msg) => {
      typeof cbComplete === 'function' && cbComplete();
    },
  });
}

function wxShowShareMenu(cbSuccess, cbFail, cbComplete) {
  wx.showShareMenu({
    success: (res) => {
      typeof cbSuccess === 'function' && cbSuccess(res);
    },
    fail: (msg) => {
      typeof cbFail === 'function' && cbFail(msg);
    },
    complete: (msg) => {
      typeof cbComplete === 'function' && cbComplete();
    }
  });
}

module.exports = {
  wxLogin: wxLogin,
  wxCheckSession: wxCheckSession,
  wxSetStorage: wxSetStorage,
  wxGetStorage: wxGetStorage,
  wxGetUserInfo: wxGetUserInfo,
  wxRequest: wxRequest,
  wxDownloadFile: wxDownloadFile,
  wxOpenDocument: wxOpenDocument,
  wxSetNavigationBarTitle: wxSetNavigationBarTitle,
  wxNavigateTo: wxNavigateTo,
  wxRedirectTo: wxRedirectTo,
  wxSwitchTab: wxSwitchTab,
  wxShowDialog: wxShowDialog,
  wxBack: wxBack,
  wxCreateCanvasContext: wxCreateCanvasContext,
  wxCanvasToTempFilePath: wxCanvasToTempFilePath,
  wxOpenMap: wxOpenMap,
  wxShowLoading: wxShowLoading,
  wxHideLoading: wxHideLoading,
  wxMakePhoneCall: wxMakePhoneCall,
  wxPay: wxPay,
  wxShowShareMenu: wxShowShareMenu
}