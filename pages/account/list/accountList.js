var accountObj = require("../../../js/Account.js");
Page({
  data: {
    accountList: null
  },
  onLoad: function () {
    var accountList = accountObj.load();
    this.setData({ accountList });
  },
  onShow: function() {
    var accountList = accountObj.load();
    this.setData({ accountList});
  },
  add: function() {
    wx.navigateTo({
      url: "../add/accountAdd"
    })
  },
  remove: function(event) {
    accountObj.remove(event.currentTarget.dataset.accountname);
    var accountList = accountObj.load();
    this.setData({ accountList });
  }
});