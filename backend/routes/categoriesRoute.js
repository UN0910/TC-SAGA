const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.route("/").get(categoryController.getCategories);
router.route("/:id").get(categoryController.getCategory);
router.route("/").post(categoryController.addCategory);
router.route("/:id").put(categoryController.updateCategory);
router.route("/:id").delete(categoryController.deleteCategory);

module.exports = router;
