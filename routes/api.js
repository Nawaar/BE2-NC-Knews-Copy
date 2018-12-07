/* eslint global-require: 0 */
const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { getEndpoints } = require('../controllers/api');
const { handle405 } = require('../error');
const { sendToken } = require('../controllers/auth');

const ENV = process.env.NODE_ENV || 'development';
const { JWT_SECRET = require('../config/auth')[ENV] } = { JWT_SECRET: process.env.JWT_SECRET };

apiRouter
  .route('/login')
  .post(sendToken)
  .all(handle405);

apiRouter.use((req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, response) => {
    if (err) next({ status: 401, msg: 'Unauthorised' });
    else next();
  });
});

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(handle405);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);


module.exports = apiRouter;
