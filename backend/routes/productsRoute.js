const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.route("/").get(productController.getProducts);
router.route("/:id").get(productController.getProduct);
router.route("/creator/:id").get(productController.getCreatorProducts);
router
  .route("/")
  .post(uploadOptions.single("image"), productController.addProduct);
router
  .route("/:id")
  .put(uploadOptions.single("image"), productController.updateProduct);
router.route("/:id").delete(productController.deleteProduct);
router.route("/get/count").get(productController.totalCount);
router.route("/get/creator/count/:id").get(productController.creatorTotalCount);
router
  .route("/get/creator/featured/count/:id")
  .get(productController.creatorFeaturedCount);
router.route("/get/featured/:count").get(productController.featuredCount);
router.route("/get/featured").get(productController.getFeaturedProducts);
router
  .route("/get/creator/featured/:id")
  .get(productController.getCreatorFeaturedProducts);

module.exports = router;
