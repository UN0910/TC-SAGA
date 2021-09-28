const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/register").post(userController.register);
router.route("/confirm-email/:token").get(userController.confirmEmail);
router.route("/resend-verification").post(userController.resendEmail);
router.route("/login").post(userController.login);
router.route("/update/:id").post(userController.update);
router.route("/delete/:id").get(userController.delete);
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password/:token").get(userController.reset);
router.route("/reset-password/:token").post(userController.resetPassword);

module.exports = router;
