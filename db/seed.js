const {sequelize} = require('./db');
const seed = require('./seedFn');
  

let buildDB = async () => {
    seed()
    .then(() => {
      console.log('Seeding success. Laughs on!');
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      // sequelize.close();
    });
}

module.exports = {buildDB}