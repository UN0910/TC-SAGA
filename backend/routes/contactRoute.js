const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.route("/").get(contactController.getContacts);
router.route("/:id").get(contactController.getContact);
router.route("/").post(contactController.addContact);
router.route("/:id").put(contactController.updateContact);
router.route("/:id").delete(contactController.deleteContact);

module.exports = router;
