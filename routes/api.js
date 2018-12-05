const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { getEndpoints } = require('../controllers/api');
const { handle405 } = require('../error');

apiRouter.route('/')
  .get(getEndpoints)
  .all(handle405);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);


module.exports = apiRouter;
