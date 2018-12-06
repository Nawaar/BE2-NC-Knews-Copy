
exports.handle422 = (err, req, res, next) => {
  const errors = {
    23505: 'duplicate key value violates unique constraint',
  };
  if (err.table === 'articles' && err.constraint === 'articles_user_id_foreign' && err.code === '23503') {
    res.status(422).json({ msg: 'violates foreign key constraint' });
  } else if (err.table === 'comments' && err.constraint === 'comments_user_id_foreign' && err.code === '23503') {
    res.status(422).json({ msg: 'violates foreign key constraint' });
  } else if (errors[err.code]) res.status(422).json({ msg: errors[err.code] });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const errors = {
    42703: 'invalid input',
    '22P02': 'invalid input syntax',
  };
  if (err.status === 400) res.status(400).json({ msg: err.msg });
  else if (errors[err.code]) res.status(400).json({ msg: errors[err.code] });
  else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).json({ msg: 'invalid method' });
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).json({ msg: err.msg });
  else if (err.code === '23503' && err.table === 'articles' && err.constraint === 'articles_topic_foreign') res.status(404).json({ msg: 'Topic not found' });
  else if (err.code === '23503' && err.table === 'comments' && err.constraint === 'comments_article_id_foreign') res.status(404).json({ msg: 'Article not found' });
  else next(err);
};

exports.handle401 = (err, req, res, next) => {
  if (err.status === 401) res.status(401).json({ msg: err.msg });
  else next(err);
};
