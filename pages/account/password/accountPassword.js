var accountObj = require("../../../js/Account.js");
var StringUtils = require("../../../js/StringUtils.js");
var TokenManager = require("../../../js/TokenManager.js");
Page({
  data: {
    accountName: null,
    username: null,
    token: null,
    tip: null,
    secureKey: null,
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
  secureKeyBindinput: function(e){
    this.data.secureKey = e.detail.value;
  },
  generatePassword: function (e) {
    var secureKey = this.data.secureKey;
    if (StringUtils.isNull(secureKey)) {
      wx.showModal({
        content: "密钥不能为空！",
        showCancel: false
      });
      throw "密钥不能为空！";
    };

    var accountName = this.data.accountName;
    var account = accountObj.find(accountName);

    var password = TokenManager.generatePassword(account.token, secureKey);
    
    this.setData({
      accountName: account.accountName,
      username: account.username,
      token: account.token,
      tip: account.tip,
      secureKey: null
    });

    wx.showModal({
      content: password,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          password = null;
        }
      }
    });
  }
})