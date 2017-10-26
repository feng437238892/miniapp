//server api:
// const server = "https://fe.fortrun.cn/mock";
const server = "https://intg.fortrun.cn/pisces";
// const server = "https://qa.fortrun.cn/pisces";
// const server = "https://gem.fortrun.cn/pisces";
// const server = "https://stg.fortrun.cn/pisces";
// const server = "https://mockwqt.fortrun.cn/pisces";

// NOTICE: 需要在上传时确认
const appid = "wx7db23a53ebce339d"; // 微前台 app id
// const appid = "wx58254a90662fcb64"; // 影宿 app id
// const appid = "wxe21c3cbe71012ada"; // 缦酒店微前台 -> mock app id
// const appid = "wx6ff7d2147412f5a7"; // 缦客 app id
// const appid = "wxbdd06d9fc88e1041"; // 圣淘沙 app id
// const appid = "wx116cc9da3848eb74"; // 书香月亮湾 app id
// const appid = "wx3e287279e2811545"; // 书香树山温泉 app id
// const appid = "wxf697102c421db772"; // 天鹅恋酒店 app id
// const appid = "wxbd502aed949af5f7"; // 雅园塘朗 app id
// const appid = "wx653c155b3b4446ac"; // QA-B app id
// const appid = "wxe4c553dd8a0bbfb9"; // 雅园世界之窗等 app id
// const appid = "wxf900343ba7c7fe0b"; // 汉姆连锁 app id
// const appid = "wxc8e285ba3af58484"; // 维也纳大学城 app id
// const appid = "wx169c110e7524235e"; // 天涯海阁 app id
// const appid = "wx5165daa315a8a31d"; // 中南海悦 app id
// const appid = "wx7b98d375554c8308"; // 鸿隆明华轮 app id
// const appid = "wxd7e9a1c18278d415"; // 深圳市南山区丽景商务酒店 app id
// const appid = "wxba0f778afc2a5391"; // 吉林 app id
// const appid = "wxe4e039ed0c82e78f"; // 荣凯国际大酒店 app id
// const appid = "wx9f3d4730d15a866e"; // 深圳利群商务酒店 app id
// const appid = "wx1dbf49dea996aac2"; // 古井集团 app id

//socket api:
const yunbaServer = "wss://abj-rest-fc1.yunba.io/";
// const yunbaServer = "https://sock.yunba.io:443/";
const yunbaAppkey = "581202f86cf991dc38fd2078";
const yunbaTopic = "miniapps/";

module.exports = {
  server: server,
  appid: appid,
  yunbaServer: yunbaServer,
  yunbaAppkey: yunbaAppkey,
  yunbaTopic: yunbaTopic
}