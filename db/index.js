const {BlogEntry} = require('./BlogEntry');
const {Author} = require('./Author');
const {sequelize, Sequelize} = require('./db');

Author.hasMany(BlogEntry);
BlogEntry.belongsTo(Author, {
    foreignKey: 'authorId',
    as: 'username'
  });

module.exports = {
    BlogEntry,
    Author,
    sequelize,
    Sequelize
};
