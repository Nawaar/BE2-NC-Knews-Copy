const bcrypt = require('bcrypt');

exports.userameWithId = function (arr) {
  return arr.reduce((accObj, currObj) => {
    accObj[currObj.username] = currObj.user_id;
    return accObj;
  }, {});
};

exports.articleNameWithId = function (arr) {
  return arr.reduce((accObj, currObj) => {
    accObj[currObj.title] = currObj.article_id;
    return accObj;
  }, {});
};

exports.formatUsers = function (rawUsers) {
  return rawUsers.map(userInfo => ({
    ...userInfo,
    password: bcrypt.hashSync(userInfo.password, 10),
  }));
};
