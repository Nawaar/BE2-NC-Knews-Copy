const connection = require('../db/connection');

exports.generalComments = (req, res, next, byArticle, oneComment) => {
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
    .modify((commentQuery) => {
      if (byArticle) commentQuery.where({ article_id: req.params.article_id });
    })
    .modify((commentQuery) => {
      if (oneComment) commentQuery.where({ comment_id: req.params.comment_id });
    })
    .join('users', 'users.user_id', 'comments.user_id')
    .limit(limit)
    .offset(limit * (p - 1))
    .orderBy(sort_by, order_by)
    .then((comments) => {
      if (byArticle || oneComment) {
        if (comments.length === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      }
      if (oneComment) {
        const comment = comments[0];
        return res.status(200).json({ comment });
      }
      return res.status(200).json({ comments });
    })
    .catch(next);
};
