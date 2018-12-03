const apiRouter = require('express').Router();
const topicsRouter = require('./topics');

apiRouter.use('/topics', topicsRouter);


module.exports = apiRouter;
