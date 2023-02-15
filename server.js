const app = require('./index');
const { sequelize } = require('./db');

const { PORT = 4000 } = process.env;

app.listen(PORT, () => {
  sequelize.sync({ force: true });
  console.log(`Users are ready at http://localhost:${PORT}`);
});