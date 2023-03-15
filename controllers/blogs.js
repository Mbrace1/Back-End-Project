const { BlogEntry } = require("../db");

// CREATE BLOG
exports.create = async(req, res) => {
    try {
      const { title, tag, body } = req.body;
      const createBlog =  await BlogEntry.create({
        title,
        tag,
        body,
        authorId: req.user.id
      });
  
      res.send(createBlog);
  
    } catch (error) {
      console.error("blogs: createOne", error);
    }
  
  }
  
  // DELETE BLOG
  exports.delete = async (req, res) => {
    try {
      const {id} = req.params;
      const deleteBlog = await BlogEntry.findByPk(id);
  
      if (!deleteBlog) {
        res.send("Blog not found.");
        return;
      }

      if (deleteBlog.authorId !== req.user.id) {
        res.send("You cannot deelte this blog. Authors can only delete their own blogs");
        return;
      }
  
      await deleteBlog.destroy();
      res.send("This blog was deleted.");
   
    } catch (error) {
      console.error("blogs: deleteOne", error);
    }
  
  }
  
  // EDIT BLOG - not working atm
  exports.edit = async (req, res) => {
    try {
      const { title, tag, body } = req.body;
      const {id} = req.params;
      const editBlog = await BlogEntry.findByPk(id);
      // const oldCopy = await BlogEntry.findOne( { where: {id : id} });
  
      if (!editBlog) {
        res.send("Blog not found.");
        return;
      }

      if (editBlog.authorId !== req.user.id) {
        res.send("You cannot edit this blog. Authors can only edit their own blogs");
        return;
      }
  
      await editBlog.update({
        title,
        tag,
        body,
        authorId: req.user.id
      });
  
      res.send(editBlog);
   
    } catch (error) {
      console.error("blogs: editOne", error);
    }
  
  }