const usersRouter = require('express').Router();
const { getUsers, getUser } = require('../controllers/users');
const { handle405 } = require('../error');

usersRouter.param('user_id', (req, res, next, user_id) => {
  if (Number.isInteger(+user_id) && !user_id.includes('.')) next();
  else next({ status: 400, msg: 'invalid input syntax' });
});

usersRouter
  .route('/')
  .get(getUsers)
  .all(handle405);

usersRouter
  .route('/:user_id')
  .get(getUser)
  .all(handle405);

module.exports = usersRouter;
