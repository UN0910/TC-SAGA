const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

exports.Contact = mongoose.model("Contact", contactSchema);
