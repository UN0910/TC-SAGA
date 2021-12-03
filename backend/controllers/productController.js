const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");
const { Category } = require("../models/categoryModel");
const { Wishlist } = require("../models/wishlistModel");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

exports.getProducts = async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter)
    .populate("category")
    .populate("postedBy");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
};

exports.getCreatorFeaturedProducts = async (req, res) => {
  const productList = await Product.find({
    postedBy: req.params.id,
    isFeatured: true,
  }).limit(5);

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
};

exports.getFeaturedProducts = async (req, res) => {
  const productList = await Product.find({ isFeatured: true }).limit(5);

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
};

exports.getCreatorProducts = async (req, res) => {
  const productList = await Product.find({ postedBy: req.params.id })
    .populate("category")
    .populate("postedBy");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("postedBy");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
};

exports.addProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    detailDescription: req.body.detailDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    postedBy: req.body.postedBy,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
};

exports.updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product!");

  const user = await User.findById(product.postedBy);

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      detailDescription: req.body.detailDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.USER_NAME, // test user
      pass: process.env.USER_PASSWORD, // test password
    },
  });

  const mailOptions = {
    to: user.email,
    from: '"TC-SAGA" <tcsaga0910@hotmail.com>',
    subject: "Product Update",
    html: `<p>Hello, ${user.userName}</p>
    <p>This is to inform you that your product ${product.name} has recently been updated.</p>
    <p>For any queries, you can contact us!!!</p>
    <p>Thanks,</p>
    <p>Your TC-SAGA team</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).json({
      message: "Mail Sent!",
    });
    console.log("Message sent: %s", info.messageId);
  });

  if (!updatedProduct)
    return res.status(500).send("the product cannot be updated!");

  res.send(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
  const productInfo = await Product.findById(req.params.id);
  const user = await User.findById(productInfo.postedBy);

  Product.findByIdAndRemove(req.params.id)
    .then(async (product) => {
      if (product) {
        await Wishlist.deleteMany({ product: req.params.id });

        let transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
            user: process.env.USER_NAME, // test user
            pass: process.env.USER_PASSWORD, // test password
          },
        });

        const mailOptions = {
          to: user.email,
          from: '"TC-SAGA" <tcsaga0910@hotmail.com>',
          subject: "Product Deleted",
          html: `<p>Hello, ${user.userName}</p>
          <p>This is to inform you that your product ${productInfo.name} has been deleted.</p>
          <p>For any queries, you can contact us!!!</p>
          <p>Thanks,</p>
          <p>Your TC-SAGA team</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          res.status(200).json({
            message: "Mail Sent!",
          });
          console.log("Message sent: %s", info.messageId);
        });
        return res.status(200).json({
          success: true,
          message: "the product is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

exports.totalCount = async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
};

exports.creatorTotalCount = async (req, res) => {
  const productCount = await Product.find({
    postedBy: req.params.id,
  }).countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
};

exports.featuredCount = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
};

exports.creatorFeaturedCount = async (req, res) => {
  const productCount = await Product.find({
    postedBy: req.params.id,
    isFeatured: true,
  }).countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
};
