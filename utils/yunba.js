import * as config from 'config.js'
import io from '../libs/index';
import utils from './util';
import _wx  from './wx';

let tmpMessage = {};
let messageID = 0;

function connect() {
  let app = getApp();
  app.data.socket = app.data.io(config.yunbaServer);
}

function initListener() {
  let app = getApp();
  app.data.hasListener = true;
  let socketIO = app.data.socket;
  socketIO.on('connect', () => {
    socketIO.emit('connect_v2', {
      appkey: config.yunbaAppkey,
      customid: app.data.session
    });
  });
  socketIO.on('connack', (msg) => {
    if (msg['success'] == true) {
      console.log(socketIO);
    } else {
      _wx.wxShowDialog({
        message: '网络连接超时，请稍后重试'
      });
    }
  });
  socketIO.on('message', (args) => {
    typeof app.messageListener === 'function' && app.messageListener(args);
  });
  socketIO.on('puback', (res) => {
    console.log("*******************puback");
    console.log(res);
    if (res.success) {
      typeof cbSuccess === 'function' && cbSuccess();
    } 
  });
  socketIO.on('suback', (args) => {
    console.log('suback');
  });
  socketIO.on('disconnect', (msg) => {
    console.log('disconnect', msg);
    // socketIO.emit('connect'); 
    // !isConnecting && connect(); 
  });
  socketIO.on('error', (msg) => {
    console.log('error', msg);
  });
  socketIO.on('close', (msg) => {
    console.log('close', msg);
  });
  socketIO.on('unsuback', (args) => {
    console.log('unsuback');
  });
  socketIO.on('connect_error', (args) => {
    console.log('connect_error', args);
  });
  socketIO.on('connect_timeout', (args) => {
    console.log('connect_timeout', args);
  });
  socketIO.on('connecting', (args) => {
    console.log('connecting', args);
  });
  socketIO.on('reconnect_attempt', (args) => {
    console.log('reconnect_attempt', args);
  });
  socketIO.on('reconnecting', (args) => {
    console.log('reconnecting', args);
  });
  socketIO.on('reconnect_error', (args) => {
    console.log('reconnect_error', args);
  });
  socketIO.on('reconnect_failed', (args) => {
    console.log('reconnect_failed', args);
  });
}

function subscribe(topic) {
  let app = getApp();
  let socketIO = app.data.socket;
  if (!socketIO.connected) {
    return;
  }
  socketIO.emit('subscribe', {
    'topic': topic
  });
}

function unSubscribe(topic) {
  let app = getApp();
  let socketIO = app.data.socket;
  if (!socketIO.connected) {
    return;
  }
  socketIO.emit('unsubscribe', {
    'topic': topic
  });
}


function publish(data) {
  let app = getApp();
  let socketIO = app.data.socket;
  if (!socketIO) {
    connect();
    initListener();
    // 这里有点恶心，谁维护到请小心。
    setTimeout(() => {
      isConnected() && publish2(data);
    }, 2000);
    return;
  } 
  isConnected() && publish2(data);
}

function isConnected() {
  let app = getApp();
  if (!app.data.socket.connected) {
    this.data.socket.emit('connect');
    _wx.wxShowDialog({
      message: '网络异常，请稍后重试'
    });
  }
  return app.data.socket.connected;
}

function publish2(data) {
  let app = getApp();
  let {
    topic,
    params = {},
    qos = 1,
    sender,
    messageId
  } = data;
  console.log("*******************publish");
  console.log(data);
  params['tid'] = utils.getUniqueId();
  tmpMessage = data;
  messageId =  messageId ? messageId : messageID++;
  if (messageId > 65535) {
    messageID = 0;
  }
  let socketIO = app.data.socket;
  socketIO.emit('publish2', {
    topic: topic,
    msg: JSON.stringify(params),
    opts: {
      qos: qos,
      time_to_live: 5,
      messageId: messageId
    }
  });
}

module.exports = {
  connect: connect,
  subscribe: subscribe,
  unSubscribe: unSubscribe,
  publish: publish,
  initListener: initListener
}