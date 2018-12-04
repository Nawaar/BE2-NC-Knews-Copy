const connection = require('../db/connection');

exports.getArticlebyTopic = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending,
  } = req.query;
  let order_by = 'desc';
  if (sort_ascending) {
    order_by = 'asc';
  }
  connection
    .select('username AS author', 'title', 'articles.article_id', 'votes', 'created_at', 'topic', 'comment_count')
    .from('articles')
    .where({ topic: req.params.topic })
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin(
      connection
        .select('article_id')
        .from('comments')
        .count('comments.article_id AS comment_count')
        .groupBy('comments.article_id')
        .as('count_table'),
      'articles.article_id', 'count_table.article_id',
    )
    .limit(limit)
    .offset(limit * (p - 1))
    .orderBy(sort_by, order_by)
    .then((articles) => {
      if (articles.length === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      return res.status(200).json({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const toInsert = {
    ...req.body,
    ...req.params,
  };
  connection
    .insert(toInsert)
    .into('articles')
    .returning('*')
    .then(([article]) => {
      res.status(201).json({ article });
    })
    .catch(next);
};
