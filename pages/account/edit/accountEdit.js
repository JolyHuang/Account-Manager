var accountObj = require("../../../js/Account.js");
var StringUtils = require("../../../js/StringUtils.js");
Page({
  data: {
    accountName: null,
    username: null,
    token: null,
    tip: null
  },
  onLoad: function (options) {
    var account = accountObj.find(options.accountName);
    this.setData({
      accountName: account.accountName,
      username: account.username,
      token: account.token,
      tip: account.tip
    });
  },
  accountNameBindinput: function (e) {
    this.data.accountName = e.detail.value;
  },
  usernameBindinput: function (e) {
    this.data.username = e.detail.value;
  },
  tokenBindinput: function (e) {
    this.data.token = e.detail.value;
  },
  tipBindinput: function (e) {
    this.data.tip = e.detail.value;
  },
  edit: function (e) {

    if (StringUtils.isNull(this.data.username)) {
      wx.showModal({
        content: "用户名不能为空！",
        showCancel: false
      });
      throw "用户名不能为空！";
    };

    if (StringUtils.isNull(this.data.token)) {
      wx.showModal({
        content: "口令不能为空！",
        showCancel: false
      });
      throw "口令不能为空！";
    };

    var account = {
      accountName: this.data.accountName,
      username: this.data.username,
      token: this.data.token,
      tip: this.data.tip || ""
    }

    accountObj.edit(account);

    wx.showToast({
      title: "已完成",
      icon: "success",
      duration: 3000
    });

    wx.navigateBack({
      delta: 1
    });
  }

})