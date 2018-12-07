const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../db/connection');

const ENV = process.env.NODE_ENV || 'development';
const { JWT_SECRET } = ENV === 'production' ? { JWT_SECRET: process.env.JWT_SECRET } : require('../config/auth');


exports.sendToken = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, msg: 'invalid input' });
  } else {
    connection
      .select('username', 'password')
      .from('users')
      .where({ username })
      .then(([user]) => {
        if (!user) return Promise.reject({ status: 401, msg: 'Unauthorised' });
        return Promise.all([bcrypt.compare(password, user.password), user]);
      })
      .then(([passwordOk, user]) => {
        if (user && passwordOk) {
          const token = jwt.sign(
            { user: user.username, iat: Date.now() },
            JWT_SECRET,
          );
          res.send({ token });
        } else {
          next({ status: 401, msg: 'Unauthorised' });
        }
      })
      .catch(next);
  }
};
