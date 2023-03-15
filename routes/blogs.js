const controller = require("../controllers/blogs");
const { checkAuthor } = require("../middleware");
const router = require("express").Router();

//CRUD
router
  .post("/", controller.create)
  .put("/:id", controller.edit)
  .delete("/:id", controller.delete);

module.exports = router;