function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDateToYYYYmm(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  return year + '年' + month + '月';
}

function formatDateToYmD(unixDateStr) {
  let date = new Date(unixDateStr);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  return year + '/' + month + '/' + date.getDate();
}

function formatDateTomD(unixDateStr) {
  let date = new Date(unixDateStr);
  let month = date.getMonth() + 1;
  return month + '月' + date.getDate() + '日';
}

function formatDateTomD2(unixDateStr) {
  let date = new Date(unixDateStr);
  let month = date.getMonth() + 1;
  return month + '/' + date.getDate();
}

function formatDateToYYYYmmDDHHMM(unixDateStr) {
  let date = new Date(unixDateStr);
  let month = date.getMonth() + 1;
  if (month <10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if(day < 10) {
    day = '0' + day
  }
  let hour = date.getHours();
  if(hour <10) {
    hour = '0' + hour
  }
  let min = date.getMinutes();
  if (min < 10) {
    min = '0' + min
  }
  return date.getFullYear() + '/' + month + '/' + day + ' ' + hour + ':' + min;
}

function formatDateTohhMM(timeStamp) {
  let date = new Date(timeStamp);
  let hour = date.getHours();
  let min = date.getMinutes();
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (min < 10) {
    min = '0' + min;
  }
  return hour + ' : ' + min;
}

function getWeekdayCN(date) {
  let weekday = date.getDay();
  let weekdayCN = '';
  switch (weekday) {
    case 1:
      weekdayCN = '周一';
      break;
    case 2:
      weekdayCN = '周二';
      break;
    case 3:
      weekdayCN = '周三';
      break;
    case 4:
      weekdayCN = '周四';
      break;
    case 5:
      weekdayCN = '周五';
      break;
    case 6:
      weekdayCN = '周六';
      break;
    case 0:
      weekdayCN = '周日';
      break;
  }
  return weekdayCN;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

function getRouteMini(path) {
  const pathStr = path.__route__;
  let route = pathStr.substr(6, pathStr.length);
  let index = route.indexOf("/");
  return route.substr(0, index);
}

function objToString(obj) {
  if (!obj || obj === null) return;

  let str = '';
  for (let key in obj) {
    str += key + '=' + obj[key] + '&';
  }
  return str.substr(0, str.length - 1);
}

function parseQueryString(url) {
  let urlIndex = url.indexOf('?');
  let params = {};
  params['url'] = url.substr(0, urlIndex);
  let queryStr = url.substr(urlIndex + 1, url.length);
  let queryArray = queryStr.split("&");
  queryArray.forEach((item) => {
    let keyIndex = item.indexOf("=");
    let key = item.substr(0, keyIndex);
    let value = item.substr(keyIndex + 1, item.length);
    params[key] = value;
  });
  return params;
}

function createAssigner(keysFunc, undefinedOnly) {
  return function(obj) {
    let length = arguments.length;
    if (length < 2 || obj == null) return obj;
    for (let index = 1; index < length; index++) {
      let source = arguments[index],
        keys = keysFunc(source),
        l = keys.length;
      for (let i = 0; i < l; i++) {
        let key = keys[i];
        if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
};

function allKeys(obj) {
  let keys = [];
  for (let key in obj) keys.push(key);
  return keys;
}

function extend() {
  return createAssigner(this.allKeys);
}

function checkID(ID) {
  if (typeof ID !== 'string') return false; //'非法字符串';
  ID = ID.toLocaleLowerCase();
  let city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };
  let birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
  let d = new Date(birthday);
  let newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
  let currentTime = new Date().getTime();
  let time = d.getTime();
  let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let arrCh = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0,
    i, residue;

  if (!/^\d{17}(\d|x)$/i.test(ID)) return false; //'非法身份证';
  if (city[ID.substr(0, 2)] === undefined) return false; //"非法地区";
  if (time >= currentTime || birthday !== newBirthday) return false; //'非法生日';
  for (i = 0; i < 17; i++) {
    sum += ID.substr(i, 1) * arrInt[i];
  }
  residue = arrCh[sum % 11];
  if (residue !== ID.substr(17, 1)) return false; //'非法身份证哦';

  return true; //city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女")
}

function formateCurrency(n) {
  let num = (n || 0).toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}

function getUniqueId() {
  let d = new Date().getTime();
  d += (parseInt(Math.random() * 1000)).toString();
  return d;
};

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatDateToYYYYmm: formatDateToYYYYmm,
  getWeekdayCN: getWeekdayCN,
  isEmpty: isEmpty,
  getRouteMini: getRouteMini,
  objToString: objToString,
  formatDateToYmD: formatDateToYmD,
  formatDateTomD: formatDateTomD,
  formatDateTomD2: formatDateTomD2,
  parseQueryString: parseQueryString,
  formatDateTohhMM: formatDateTohhMM,
  extend: extend,
  formateCurrency: formateCurrency,
  checkID: checkID,
  getUniqueId: getUniqueId,
  formatDateToYYYYmmDDHHMM: formatDateToYYYYmmDDHHMM
}