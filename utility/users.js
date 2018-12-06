const connection = require('../db/connection');

exports.generalUsers = (req, res, next, oneUser) => {
  connection
    .select('name', 'user_id', 'username', 'avatar_url')
    .from('users')
    .modify((userQuery) => {
      if (oneUser) userQuery.where({ user_id: req.params.user_id });
    })
    .then((users) => {
      if (oneUser) {
        const user = users[0];
        if (!user) return Promise.reject({ status: 404, msg: 'Page does not exist' });
        return res.status(200).json({ user });
      }
      return res.status(200).json({ users });
    })
    .catch(next);
};
