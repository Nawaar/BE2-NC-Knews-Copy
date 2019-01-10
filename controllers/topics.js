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
  if (req.body.slug && req.body.description) {
    const { slug, description } = req.body;
    connection
      .returning('*')
      .insert({ slug: slug.toLowerCase(), description })
      .into('topics')
      .then(([topic]) => {
        res.status(201).json({ topic });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: 'invalid input' });
  }
};
