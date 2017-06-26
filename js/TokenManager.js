var SHA3 = require("SHA3.js");
var MD5 = require("MD5.js");
var StringUtils = require("StringUtils.js");

module.exports = {
  generatePassword: function (token, secureKey) {

    var secureKeyToken = SHA3.enc.Utf8.parse(token + secureKey);
    var sha3MD5Hash = this.getSHA3MD5Hash(secureKeyToken);
    var sha3MD5HashNumber = this.getUnicodeTotal(sha3MD5Hash);

    var tokenCharArray = this.geTokenCharArray(token);
    tokenCharArray = this.reorderTokenCharArray(tokenCharArray, sha3MD5HashNumber);

    var password="";
    var parent = this;
    tokenCharArray.forEach(function (tokenChar) {
      if (StringUtils.isNumber(tokenChar)) {
        password += parent.getNumber(sha3MD5HashNumber, tokenChar);
      } else if (StringUtils.isAlphabet(tokenChar)){
        password += parent.getAlphabet(sha3MD5HashNumber, tokenChar);
      }else {
        password += parent.getPunctuation(sha3MD5HashNumber, tokenChar);
      }
    });
    return password;
  },
  getNumber: function (sha3MD5HashNumber, tokenChar) {
    var num = sha3MD5HashNumber + tokenChar.charCodeAt(0);

    return StringUtils.numberArray[num % StringUtils.numberArray.length];
  },
  getAlphabet: function (sha3MD5HashNumber, tokenChar) {
    var num = sha3MD5HashNumber + tokenChar.charCodeAt(0);

    return StringUtils.alphabetArray[num % StringUtils.alphabetArray.length];
  },
  getPunctuation: function (sha3MD5HashNumber, tokenChar) {
    var num = sha3MD5HashNumber + tokenChar.charCodeAt(0);

    return StringUtils.punctuationArray[num % StringUtils.punctuationArray.length];
  },
  getSHA3MD5Hash: function(str) {
    var token = SHA3.SHA3(str);
    token = token.toString(SHA3.enc.Base64);
    token = MD5.MD5(token);
    token = token.toString(MD5.enc.Base64);
    return token;
  },
  geTokenCharArray: function (token) {
    var tokenCharArray = new Array(token.length);
    for (var i = 0; i < token.length; i++) {
      tokenCharArray[i] = token.charAt(i);
    };
    return tokenCharArray;
  },
  getUnicodeTotal: function (token) {
    var unicodeTotal = 0;
    for (var i = 0; i < token.length; i++) {
      unicodeTotal += token.charCodeAt(i);
    };
    return unicodeTotal;
  },
  arrayToString: function (tokenCharArray) {
    var token = "";
    tokenCharArray.forEach(function (tokenChar) {
      token += tokenChar;
    });
    return token;
  },
  reorderTokenCharArray(tokenCharArray, sha3MD5HashNumber) {
    var tokenCharArrayLength = tokenCharArray.length;
    var tempTokenCharArray = new Array();
    tokenCharArray.forEach(function (tokenChar, index) {
      tempTokenCharArray[index] = tokenCharArray[(sha3MD5HashNumber + index) % tokenCharArray.length];
    });
    tempTokenCharArray.forEach(function (tokenChar, index) {
      tokenCharArray[index] = tokenChar;
    });

    var currentChar = tokenCharArray[0];
    tokenCharArray.splice(0, 1)
    for (var i = 1; i < tokenCharArrayLength; i++) {
      var currentIndex = (sha3MD5HashNumber + currentChar.charCodeAt(0)) % tokenCharArray.length;
      currentChar = tokenCharArray[currentIndex];
      tempTokenCharArray[i] = currentChar;
      tokenCharArray.splice(currentIndex,1);
    };

    return tempTokenCharArray;
  }

};