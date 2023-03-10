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
// routes to use authentication
app.use("/blogs", requiresAuth);


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

// CREATE BLOG
app.post("/blogs/create/", async(req, res) => {
  try {
    const { title, tag, body, authorId } = req.body;
    const createBlog =  await BlogEntry.create({
      title,
      tag,
      body,
      authorId
    });

    res.send(createBlog);

  } catch (error) {
    console.error("blogs: createOne", error);
  }

})

// DELETE BLOG
app.delete("/blogs/delete/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const deleteBlog = await BlogEntry.findOne( { where: {id : id} });

    if (!deleteBlog) {
      res.send("Blog not found.");
      return;
    }

    await deleteBlog.destroy();
    res.send("This blog was deleted.");
 
  } catch (error) {
    console.error("blogs: deleteOne", error);
  }

})

// EDIT BLOG - not working atm
app.put("/blogs/edit/:id", async(req, res) => {
  try {
    const { title, tag, body, authorId } = req.body;

    const editBlog = await BlogEntry.findOne( { where: {id : id} });
    // const oldCopy = await BlogEntry.findOne( { where: {id : id} });

    if (!editBlog) {
      res.send("Blog not found.");
      return;
    }

    await editBlog.update({
      title,
      tag,
      body,
      authorId
    });

    res.send(editBlog);
 
  } catch (error) {
    console.error("blogs: editOne", error);
  }

})


// Next want to be able to create a user (sign up) and only create blogs when logged in
// CREATE USER / sign up
app.post("/authors/create/", async(req, res) => {
  try {
    const { username, password } = req.body;

    const author = await Author.findOne( { where: {username} });

    if (author) {
      res.send("This username has been taken.");
      return;
    }

    const hashedPW = await bcrypt.hash(password, 8)
    const {id} =  await Author.create({
      username,
      hashedPW,
    });
    const token = jwt.sign({id, username}, process.env.SIGN_SECRET)

    res.send({ message: "New Author created", token });
  } catch (error) {
    console.error("blogs: createOne", error);
  }
})

// LOGIN AS USER
app.post("/authors/login/", async(req, res) => {
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
})

// error handling middleware, so failed tests receive them
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
