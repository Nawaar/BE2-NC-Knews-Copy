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

exports.getArticles = (req, res, next) => {
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
    .then(articles => res.status(200).json({ articles }))
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  connection
    .select('username AS author', 'body', 'title', 'articles.article_id', 'votes', 'created_at', 'topic', 'comment_count')
    .from('articles')
    .where({ 'articles.article_id': req.params.article_id })
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
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      return res.status(200).json({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  connection
    .select('votes')
    .from('articles')
    .where({ 'articles.article_id': req.params.article_id })
    .then(([votes]) => {
      if (!votes) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      if (req.body.inc_votes === undefined) return Promise.reject({ status: 400, msg: 'invalid input' });
      return connection
        .from('articles')
        .where({ 'articles.article_id': req.params.article_id })
        .update({ votes: votes.votes + req.body.inc_votes });
    })
    .then(() => connection
      .select('username AS author', 'body', 'title', 'articles.article_id', 'votes', 'created_at', 'topic', 'comment_count')
      .from('articles')
      .where({ 'articles.article_id': req.params.article_id })
      .join('users', 'articles.user_id', 'users.user_id')
      .leftJoin(
        connection
          .select('article_id')
          .from('comments')
          .count('comments.article_id AS comment_count')
          .groupBy('comments.article_id')
          .as('count_table'),
        'articles.article_id', 'count_table.article_id',
      ))
    .then(([article]) => {
      res.status(200).json({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  connection
    .from('articles')
    .where({ 'articles.article_id': req.params.article_id })
    .del()
    .then((amount) => {
      if (amount === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      return res.status(200).json({});
    })
    .catch(next);
};
