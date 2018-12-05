const articlesRouter = require('express').Router();
const {
  getArticles, getArticle, patchArticleVotes, deleteArticle,
} = require('../controllers/articles');
const {
  getCommentsByArticle, postComment, patchCommentVotes, deleteComment,
} = require('../controllers/comments');
const { handle405 } = require('../error');

articlesRouter.param('article_id', (req, res, next, article_id) => {
  if (Number.isInteger(+article_id) && !article_id.includes('.')) next();
  else next({ status: 400, msg: 'invalid input syntax' });
});

articlesRouter.param('comment_id', (req, res, next, comment_id) => {
  if (Number.isInteger(+comment_id) && !comment_id.includes('.')) next();
  else next({ status: 400, msg: 'invalid input syntax' });
});

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
  .get(getCommentsByArticle)
  .post(postComment)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(patchCommentVotes)
  .delete(deleteComment)
  .all(handle405);

module.exports = articlesRouter;
