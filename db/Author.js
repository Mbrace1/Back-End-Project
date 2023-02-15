const {Sequelize, sequelize} = require('./db');

const Author = sequelize.define('author', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

module.exports = { Author };
