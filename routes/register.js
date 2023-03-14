const { Author } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Author.findOne({ where: { username } });
    if (user) {
      res.send("Username already taken.");
      return;
    }
    const hashedPW = await bcrypt.hash(password, 8);
    const { id } = await Author.create({ username, password: hashedPW });
    const token = jwt.sign({ id, username }, process.env.SIGNING_SECRET);
    res.send({ message: "registered user", token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
