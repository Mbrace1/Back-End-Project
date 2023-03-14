const { Author } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN AS USER
module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { id, password: hashedPW } = await Author.findOne({
            where: { username },
        });

        if (id) {
            const isMatch = await bcrypt.compare(password, hashedPW);
            if (isMatch) {
                const token = jwt.sign({ id, username }, process.env.SIGN_SECRET);
                res.send({ message: "success", token });
                return;
            }
        }
        res.send("Unauthorized");
    } catch (error) {
        console.error("blogs: createOne", error);
    }
}