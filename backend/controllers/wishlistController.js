const { Wishlist } = require("../models/wishlistModel");

exports.getWishlists = async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.params.id }).populate(
    "product"
  );

  if (!wishlist) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(wishlist);
};

exports.checkProductInWishlists = async (req, res) => {
  const wishlist = await Wishlist.findOne({
    product: req.params.product,
    user: req.params.user,
  }).populate("product");

  if (!wishlist) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(wishlist);
};

exports.addWishlist = async (req, res) => {
  const wishlistExist = await Wishlist.findOne({
    product: req.body.product,
    user: req.body.user,
  });
  if (wishlistExist) {
    return res.status(300).json({
      error: "Card Already exists in the wishlist!!!!",
      status: false,
    });
  }
  let wishlist = new Wishlist({
    product: req.body.product,
    user: req.body.user,
  });
  wishlist = await wishlist.save();

  if (!wishlist)
    return res.status(400).json({
      error: "Card can't be added to the the wishlist!!!!",
      status: false,
    });

  res.send(wishlist);
};

exports.deleteWishlist = async (req, res) => {
  Wishlist.findByIdAndRemove(req.params.id)
    .then((wishlist) => {
      if (wishlist) {
        return res
          .status(200)
          .json({ success: true, message: "the wishlist is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "wishlist not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};
