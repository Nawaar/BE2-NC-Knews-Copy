const connection = require('../db/connection');
const { generalArticles } = require('../utility/articles');

exports.getArticlebyTopic = (req, res, next) => {
  generalArticles(req, res, next, true, false);
};

exports.postArticle = (req, res, next) => {
  if (req.body.title && req.body.user_id && req.body.body) {
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
  } else {
    next({ status: 400, msg: 'invalid input' });
  }
};

exports.getArticles = (req, res, next) => {
  generalArticles(req, res, next, false, false);
};

exports.getArticle = (req, res, next) => {
  generalArticles(req, res, next, false, true);
};

exports.patchArticleVotes = (req, res, next) => {
  if (req.body.inc_votes) {
    connection
      .select('votes')
      .from('articles')
      .where({ 'articles.article_id': req.params.article_id })
      .then(([votes]) => {
        if (!votes) return Promise.reject({ status: 404, msg: 'Page does not exist' });
        return connection
          .from('articles')
          .where({ 'articles.article_id': req.params.article_id })
          .update({ votes: votes.votes + req.body.inc_votes });
      })
      .then(() => generalArticles(req, res, next, false, true))
      .catch(next);
  } else {
    next({ status: 400, msg: 'invalid input' });
  }
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
