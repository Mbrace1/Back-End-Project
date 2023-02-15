const {Sequelize, sequelize} = require('./db');

const BlogEntry = sequelize.define('blogEntry', {
  title: Sequelize.STRING,
  tag: Sequelize.STRING,
  body: Sequelize.STRING,
  ownerId: Sequelize.INTEGER
  // date, 
});

module.exports = { BlogEntry };
