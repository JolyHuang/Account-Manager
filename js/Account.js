module.exports = {
  load: function () {
    return wx.getStorageSync("accountList") || new Array();
  },
  save: function (accountList) {
    wx.setStorageSync("accountList", accountList);
  },
  add: function (account) {
    var accountList = this.load();
    accountList.forEach(function (acc) {
      if (acc.accountName == account.accountName) {
        wx.showToast({
          title: "标题'" + account.accountName + "'重复！",
          icon: "fail",
          duration: 3000
        });
        throw "标题'" + account.accountName + "'重复！";
      };
    });
    accountList.push(account);
    this.save(accountList);
  },
  remove: function (accountName) {
    var accountList = this.load();
    accountList.forEach(function (account, index) {
      if (account.accountName == accountName) {
        accountList.splice(index,1);
        return;
      };
    });
    this.save(accountList);
  },
  edit: function (account) {
    var accountList = this.load();
    accountList.forEach(function (acc) {
      if (acc.accountName == account.accountName) {
        acc.username = account.username;
        acc.token = account.token;
        acc.tip = account.tip;

        return;
      };
    });
    this.save(accountList);
  },
  find: function (accountName) {
    var accountList = this.load();

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