const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics');
const { getArticlebyTopic } = require('../controllers/articles');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlebyTopic);


module.exports = topicsRouter;
