const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/").get(userController.getUsers);
router.route("/admin").get(userController.getAdmins);
router.route("/creator").get(userController.getCreators);
router.route("/:id").get(userController.getUser);
router.route("/").post(userController.addUser);
router.route("/:id").put(userController.update);
router.route("/:id").delete(userController.delete);
router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/confirm-email/:token").get(userController.confirmEmail);
router.route("/resend-verification").post(userController.resendEmail);
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password/:token").get(userController.reset);
router.route("/reset-password/:token").post(userController.resetPassword);
router.route("/get/count").get(userController.totalCount);

module.exports = router;
