const connection = require('../db/connection');

exports.getTopics = (req, res, next) => {
  connection
    .select('*')
    .from('topics')
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  connection
    .returning('*')
    .insert(req.body)
    .into('topics')
    .then(([topic]) => {
      res.status(201).json({ topic });
    })
    .catch(next);
};
