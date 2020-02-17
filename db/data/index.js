const test = require('./test-data');
const development = require('./development-data');
const docker = require('./development-data');

const env = process.env.NODE_ENV || 'development';

const data = { test, development, docker };

module.exports = data[env];
