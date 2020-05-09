const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: 'root',
    password: '',
    database: 'sql-starter',
    host: 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  keys: {
    SECRET_KEY:
      process.env.SECRET_KEY || 'a31eb4f32dac0841fd4b14dba5a09468',
    REFRESH_KEY:
      process.env.REFRESH_KEY || 'ab118c088d90596b62c6467c2b815b2c'
  }
};
