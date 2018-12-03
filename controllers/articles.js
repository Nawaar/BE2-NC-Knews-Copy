const connection = require('../db/connection');

exports.getArticlebyTopic = (req, res, next) => {
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
    .limit(10)
    .orderBy('created_at', 'desc')
    .then((articles) => {
      res.status(200).json({ articles });
    })
    .catch(next);
};
