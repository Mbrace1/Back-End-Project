const {BlogEntry} = require('./BlogEntry');
const {Author} = require('./Author');
const {sequelize, Sequelize} = require('./db');

Author.hasMany(BlogEntry);
BlogEntry.belongsTo(Author, {id: 'ownerId'}); // blogEntry table, there will be an ownerId <- FK

module.exports = {
    BlogEntry,
    Author,
    sequelize,
    Sequelize
};
