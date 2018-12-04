const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);


module.exports = apiRouter;
