var StringUtils = require("StringUtils.js");

module.exports = {
  storageKeyName: "accountGroups",
  load: function () {
    var accountGroups = wx.getStorageSync(this.storageKeyName);
    if (StringUtils.isNull(accountGroups)) {
      accountGroups = [{
        groupId: "common",
        accountList: new Array()
      }]
    };
    return accountGroups;
  },
  save: function (accountGroups) {
    wx.setStorageSync(this.storageKeyName, accountGroups);
  },
  add: function (account) {
    var accountGroups = this.load();
    var accountList = accountGroups[0].accountList;
    accountList.forEach(function (acc) {
      if (acc.accountName == account.accountName) {
        wx.showModal({
          content: "标题'" + account.accountName + "'重复！",
          showCancel: false
        });
        throw "标题'" + account.accountName + "'重复！";
      };
    });
    accountList.push(account);
    this.save(accountGroups);
  },
  remove: function (accountName) {
    var accountGroups = this.load();
    var accountList = accountGroups[0].accountList;
    accountList.forEach(function (account, index) {
      if (account.accountName == accountName) {
        accountList.splice(index,1);
        return;
      };
    });
    this.save(accountGroups);
  },
  edit: function (account) {
    var accountGroups = this.load();
    var accountList = accountGroups[0].accountList;
    accountList.forEach(function (acc) {
      if (acc.accountName == account.accountName) {
        acc.username = account.username;
        acc.token = account.token;
        acc.tip = account.tip;

        return;
      };
    });
    this.save(accountGroups);
  },
  find: function (accountName) {
    var accountGroups = this.load();
    var accountList = accountGroups[0].accountList;

    var acc;
    accountList.forEach(function (account) {
      if (account.accountName == accountName) {
        acc = account;
        return;
      };
    });

    return acc;
  }
}