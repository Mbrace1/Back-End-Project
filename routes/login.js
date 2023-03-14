const { Author } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { id, password: hashedPW } = await Author.findOne({
      where: { username },
    });

    if (id) {
      const isMatch = await bcrypt.compare(password, hashedPW);
      if (isMatch) {
        const token = jwt.sign({ id, username }, process.env.SIGNING_SECRET);
        res.send({ message: "logged in", token });
        return;
      }
    }
    res.status(401).send("Unauthorized");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
