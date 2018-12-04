const articlesRouter = require('express').Router();
const {
  getArticles, getArticle, patchArticleVotes, deleteArticle,
} = require('../controllers/articles');
const { getCommentsByArticle } = require('../controllers/comments');
const { handle405 } = require('../error');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle);

module.exports = articlesRouter;
