const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  res.status(404).json({ msg: 'page does not exist' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ err });
});

module.exports = app;
