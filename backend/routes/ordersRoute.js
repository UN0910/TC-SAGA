const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.route("/").get(orderController.getOrders);
// router.route("/creators/:id").get(orderController.getCreatorsOrders);
router.route("/:id").get(orderController.getOrder);
router.route("/").post(orderController.addOrder);
router.route("/:id").put(orderController.updateOrder);
router.route("/:id").delete(orderController.deleteOrder);
router.route("/get/totalSales").get(orderController.totalSales);
router.route("/get/count").get(orderController.totalCount);
router.route("/get/userorders/:userid").get(orderController.userOrders);

module.exports = router;
