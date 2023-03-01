const express = require('express');
const app = express();
const {buildDB} = require('./db/seed')
const { Author, BlogEntry } = require('./db')
buildDB()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send(`
      <h1>Welcome to Super Interesting Blogging</h1>
      <p>Blogs are available at <a href="/blogs">/blogs</a></p>
      <p>Create a new cat at <b><code>POST /kittens</code></b> and delete one at <b><code>DELETE /kittens/:id</code></b></p>
      <p>Log in via POST /login or register via POST /register</p>
    `);
  } catch (error) {
    console.error(error);
    next(error)
  }
});


// GET ALL BLOGS
app.get("/blogs/", async(req, res) => {
  try {
    const blogs = await BlogEntry.findAll();
    res.send(blogs);
  } catch (error) {
    console.error("blogs: getAll", error);
    next(error);
  }
})

// GET SPECIFIC BLOG
app.get("/blogs/:id", async(req, res) => {
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
    next(error);
  }

})

// error handling middleware, so failed tests receive them
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
