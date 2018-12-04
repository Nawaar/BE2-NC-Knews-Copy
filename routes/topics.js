const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics');
const { getArticlebyTopic, postArticle } = require('../controllers/articles');
const { handle405 } = require('../error');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlebyTopic)
  .post(postArticle)
  .all(handle405);


module.exports = topicsRouter;
