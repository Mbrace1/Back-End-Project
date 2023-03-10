const {Sequelize, sequelize} = require('./db');

const BlogEntry = sequelize.define('blogEntry', {
  title: Sequelize.STRING,
  tag: Sequelize.STRING,
  body: Sequelize.STRING,
  authorId: Sequelize.INTEGER
  // date, 
});

module.exports = { BlogEntry };
