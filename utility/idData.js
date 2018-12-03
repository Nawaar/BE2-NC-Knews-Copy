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
