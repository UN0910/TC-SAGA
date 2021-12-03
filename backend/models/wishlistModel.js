const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

exports.Wishlist = mongoose.model("Wishlist", wishlistSchema);
