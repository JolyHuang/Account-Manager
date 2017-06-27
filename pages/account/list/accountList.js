var accountObj = require("../../../js/Account.js");
Page({
  data: {
    accountList: null
  },
  onLoad: function () {
    var accountGroups = accountObj.load();
    var accountList = accountGroups[0].accountList;
    this.setData({ accountList: accountList });
  },
  onShow: function() {
    var accountGroups = accountObj.load();
    var accountList = accountGroups[0].accountList;
    this.setData({ accountList: accountList });
  },
  add: function() {
    wx.navigateTo({
      url: "../add/accountAdd"
    })
  },
  remove: function(event) {
    accountObj.remove(event.currentTarget.dataset.accountname);
    var accountGroups = accountObj.load();
    var accountList = accountGroups[0].accountList;
    this.setData({ accountList: accountList });
  }
});