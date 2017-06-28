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

    var parent = this;
    var currentToken = tokenCharArray[sha3MD5HashNumber % tokenCharArray.length];
    tokenCharArray.forEach(function (tokenChar, index) {
      var curentChar = parent.getPasswordChar(sha3MD5HashNumber, tokenChar, currentToken);
      tokenCharArray[index] = curentChar;
      currentToken += curentChar;
    });

    tokenCharArray[0] = this.getPasswordChar(sha3MD5HashNumber, tokenCharArray[0], this.arrayToString(tokenCharArray));
    
    return this.arrayToString(tokenCharArray);
  },
  getNumber: function (num) {
    return StringUtils.numberArray[num % StringUtils.numberArray.length];
  },
  getAlphabet: function (num) {
    return StringUtils.alphabetArray[num % StringUtils.alphabetArray.length];
  },
  getPunctuation: function (num) {
    return StringUtils.punctuationArray[num % StringUtils.punctuationArray.length];
  },
  getPasswordChar: function (sha3MD5HashNumber, tokenChar, currentToken) {
    if (StringUtils.isNumber(tokenChar)) {
      return this.getNumber(sha3MD5HashNumber + this.getUnicodeTotal(currentToken)).toString();
    } else if (StringUtils.isAlphabet(tokenChar)) {
      return this.getAlphabet(sha3MD5HashNumber + this.getUnicodeTotal(currentToken));
    } else {
      return this.getPunctuation(sha3MD5HashNumber + this.getUnicodeTotal(currentToken));
    }

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

    if (tokenCharArrayLength == 1){
      return tokenCharArray;
    };

    var tempTokenCharArray = new Array();
    tokenCharArray.forEach(function (tokenChar, index) {
      tempTokenCharArray[index] = tokenCharArray[(sha3MD5HashNumber + index) % tokenCharArrayLength];
    });
    tempTokenCharArray.forEach(function (tokenChar, index) {
      tokenCharArray[index] = tokenChar;
    });

    var currentToken = tokenCharArray[0];
    tokenCharArray.splice(0, 1);
    var currentToken = tokenCharArray[0];
    for (var i = 1; i < tokenCharArrayLength; i++) {
      var currentIndex = (sha3MD5HashNumber + this.getUnicodeTotal(currentToken)) % tokenCharArray.length;
      currentChar = tokenCharArray[currentIndex];
      tempTokenCharArray[i] = currentChar;
      tokenCharArray.splice(currentIndex,1);
      currentToken += currentChar;
    };

    var currentIndex = (sha3MD5HashNumber + this.getUnicodeTotal(currentToken)) % tempTokenCharArray.length;
    var currentChar = tempTokenCharArray[currentIndex];
    tempTokenCharArray[currentIndex] = tempTokenCharArray[0];
    tempTokenCharArray[0] = currentChar;

    return tempTokenCharArray;
  }

};