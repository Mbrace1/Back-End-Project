const {sequelize} = require('./db');
const {BlogEntry} = require('./BlogEntry');
const {Author} = require('./Author');
const {blogEntries, authors} = require('./seedData');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db
  await Author.bulkCreate(authors);
  await BlogEntry.bulkCreate(blogEntries);
};

module.exports = seed;
