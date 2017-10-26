const app = getApp();
import * as _route from '../../routes/index';

Page({
  data: {
    title: '',
    icon: '',
    content: '',
    hint: ''
  },

  onLoad(opt) {
    let {
      title,
      icon,
      content,
      hint
    } = this.data;
    const type = opt.type || 'invoice';
    if (type === 'invoice') {
      title = '秒开票';
      icon = '../../imgs/bg_invoice.png';
      content = '在此预先录入发票信息，选择索取纸质发票或电子发票，同步提交开票申请。确认账单后我们会在您离店前准备好发票。';
      hint = '*开具电子发票服务需入住门店提供业务支持。'
    } else if (type === 'assure') {
      title = '微担保';
      icon = '../../imgs/bg_assure.png';
      content = '在此完成酒店订单的线上支付，将享受“微担保”服务，免付入住客房押金。';
      hint = '*如因客户诚信造成了损失，酒店保留依法索赔的权利。 \n*该功能需酒店支持开通。'
    } else if (type === 'face') {
      title = '刷脸住';
      icon = '../../imgs/bg_face_checkin.png';
      content = '在此预先录入住客身份信息，到店后您无需出示身份证，前台刷脸即可完成入住。';
      hint = '*刷脸住服务需入住门店提供业务支持。'
    } else {
      title = '优选房';
      icon = '../../imgs/bg_select.png';
      content = '在此您可优先选择房间。我们也会根据当前酒店房态为您推荐最优房间。';
      hint = '*支付完成后系统会为您实时锁房；\n*如您未能完成支付，选房将不被保留。'
    }
    this.setData({
      title: title,
      icon: icon,
      content: content,
      hint: hint
    });
  },

});