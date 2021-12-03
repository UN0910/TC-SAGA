const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.route("/:id").get(wishlistController.getWishlists);
router.route("/:product/:user").get(wishlistController.checkProductInWishlists);
router.route("/").post(wishlistController.addWishlist);
router.route("/:id").delete(wishlistController.deleteWishlist);

module.exports = router;
