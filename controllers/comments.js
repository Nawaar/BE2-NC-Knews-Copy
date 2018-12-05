const connection = require('../db/connection');
const { generalComments } = require('../utility/comments');

exports.getCommentsByArticle = (req, res, next) => {
  generalComments(req, res, next, true, false);
};

exports.postComment = (req, res, next) => {
  if (req.body.body && req.body.user_id) {
    const toInsert = {
      ...req.body,
      ...req.params,
    };
    connection
      .insert(toInsert)
      .into('comments')
      .returning('*')
      .then(([comment]) => {
        res.status(201).json({ comment });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: 'invalid input' });
  }
};

exports.patchCommentVotes = (req, res, next) => {
  if (req.body.inc_votes) {
    connection
      .select('votes')
      .from('comments')
      .where({
        article_id: req.params.article_id,
        comment_id: req.params.comment_id,
      })
      .then(([votes]) => {
        if (!votes) return Promise.reject({ status: 404, msg: 'Page does not exist' });
        return connection
          .from('comments')
          .where({ comment_id: req.params.comment_id })
          .update({ votes: votes.votes + req.body.inc_votes });
      })
      .then(() => generalComments(req, res, next, false, true))
      .catch(next);
  } else {
    next({ status: 400, msg: 'invalid input' });
  }
};

exports.deleteComment = (req, res, next) => {
  connection
    .from('comments')
    .where({
      article_id: req.params.article_id,
      comment_id: req.params.comment_id,
    })
    .del()
    .then((amount) => {
      if (amount === 0) return Promise.reject({ status: 404, msg: 'Page does not exist' });
      return res.status(200).json({});
    })
    .catch(next);
};
