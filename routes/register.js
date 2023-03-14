const { Author } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE USER / sign up
module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        const author = await Author.findOne({ where: { username } });

        if (author) {
            res.send("This username has been taken.");
            return;
        }

        const hashedPW = await bcrypt.hash(password, 8)
        const { id } = await Author.create({
            username,
            hashedPW,
        });
        const token = jwt.sign({ id, username }, process.env.SIGN_SECRET)

        res.send({ message: "New Author created", token });
    } catch (error) {
        console.error("blogs: createOne", error);
    }
}