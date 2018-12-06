const connection = require('../db/connection');

exports.generalArticles = (req, res, next, byTopic, oneArticle) => {
  const {
    limit = 10, p = 1, sort_ascending,
  } = req.query;
  if (Number.isInteger(+p) && !`${p}`.includes('.') && Number.isInteger(+limit) && !`${limit}`.includes('.')) {
    const columnNames = ['author', 'title', 'article_id', 'votes', 'created_at', 'topic', 'comment_count', 'body'];
    const sort_by = (columnNames.includes(req.query.sort_by)) ? req.query.sort_by : 'created_at';
    let order_by = 'desc';
    if (sort_ascending === 'true') {
      order_by = 'asc';
    }
    connection
      .select('username AS author', 'title', 'articles.article_id', 'votes', 'created_at', 'topic', 'comment_count')
      .from('articles')
      .modify((articleQuery) => {
        if (byTopic) articleQuery.where({ topic: req.params.topic });
      })
      .modify((articleQuery) => {
        if (oneArticle) articleQuery.where({ 'articles.article_id': req.params.article_id }).select('body');
      })
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
        if (byTopic || oneArticle) {
          if (articles.length === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
        }
        if (oneArticle) {
          const article = articles[0];
          return res.status(200).json({ article });
        }
        return res.status(200).json({ articles });
      })
      .catch(next);
  } else next({ status: 400, msg: 'invalid input syntax' });
};
