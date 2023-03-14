const { BlogEntry } = require("../db");

// CREATE BLOG
exports.create = async(req, res) => {
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
  
  }
  
  // DELETE BLOG
  exports.delete = async (req, res) => {
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
  
  }
  
  // EDIT BLOG - not working atm
  exports.edit = async (req, res) => {
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
  
  }