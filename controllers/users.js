const { generalUsers } = require('../utility/users');

exports.getUsers = (req, res, next) => {
  generalUsers(req, res, next, false);
};

exports.getUser = (req, res, next) => {
  generalUsers(req, res, next, true);
};
