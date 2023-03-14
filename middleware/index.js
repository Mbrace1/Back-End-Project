const jwt = require("jsonwebtoken");
const { SIGN_SECRET } = process.env;

module.exports.setUser = (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    if (!auth) {
      next();
      return;
    }
    const [, token] = auth.split(" "); // "Bearer s8u923f09sdf230fhsd32"
    const user = jwt.verify(token, process.env.SIGN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.requiresAuth = async (req, res, next) => {
  try {
    if (req.user) {
      next();
      return;
    }

    res.status(401).send("Unauthorized");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkAuthor = (req, res, next) => {
  if (req.user.id != req.params.id) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
