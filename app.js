const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const {
  handle422, handle400, handle404, handle401,
} = require('./error');

app.use(bodyParser.json());

app.use('/', (req, res, next) => {
  res.status(200).render('login');
});

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page not found' });
});

app.use(handle422);
app.use(handle400);
app.use(handle404);
app.use(handle401);

app.use((err, req, res, next) => {
  res.status(500).json({ err });
});

module.exports = app;
