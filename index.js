const express = require('express');
const app = express();
const {buildDB} = require('./db/seed')
const { Author, BlogEntry } = require('./db')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setUser, requiresAuth } = require("./middleware");
const { SIGN_SECRET } = process.env;
require('dotenv').config()
buildDB()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(setUser);


app.get('/', async (req, res) => {
  try {
    res.send(`
      <h1>Welcome to Super Interesting Blogging</h1>
      <p>View all our <a href="/blogs">blogs</a></p>
      <p>Create a new cat at <b><code>POST /kittens</code></b> and delete one at <b><code>DELETE /kittens/:id</code></b></p>
      <p>Log in via POST /login or register via POST /register</p>
    `);
  } catch (error) {
    console.error(error);
  }
});

// GET ALL BLOGS
app.get("/all-blogs/", async(req, res) => {
  try {
    const blogs = await BlogEntry.findAll({ include: [{
        model: Author,
        as: 'username',
        attributes: ['username']
    }] });
    res.send(blogs);
  } catch (error) {
    console.error("blogs: getAll", error);
  }
})

// GET SPECIFIC BLOG
app.get("/blog/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const specificBlog = await BlogEntry.findOne( { where: {id : id} });

    if (!specificBlog) {
      res.send("Blog not found.");
      return;
    }

    res.send(specificBlog);

  } catch (error) {
    console.error("blogs: getOne", error);
  }

})

// routes to use authentication
app.use("/blogs", requiresAuth);

app.post("/register", require("./routes/register"));
app.post("/login", require("./routes/login"));

// error handling middleware, so failed tests receive them
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
