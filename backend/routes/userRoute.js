const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/update/:id").post(userController.update);
router.route("/delete/:id").get(userController.delete);

module.exports = router;
