const connection = require('../db/connection');

exports.getCommentsByArticle = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  let order_by = 'desc';
  if (sort_ascending) {
    order_by = 'asc';
  }
  connection
    .select('comment_id', 'votes', 'created_at', 'body', 'username AS author')
    .from('comments')
    .where({ article_id: req.params.article_id })
    .join('users', 'users.user_id', 'comments.user_id')
    .limit(limit)
    .offset(limit * (p - 1))
    .orderBy(sort_by, order_by)
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      return res.status(200).json({ comments });
    })
    .catch(next);
};
