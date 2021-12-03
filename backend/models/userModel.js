const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    street: {
      type: String,
    },
    apartment: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: Number,
    },
    userRole: {
      type: String,
      default: "CUSTOMER",
      enum: ["CUSTOMER", "CREATOR", "ADMIN"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedToken: {
      type: String,
      required: false,
    },
    verifiedTokenExpires: {
      type: Date,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateVerifiedToken = function () {
  this.verifiedToken = crypto.randomBytes(10).toString("hex");
  this.verifiedTokenExpires = Date.now() + 86400000; //expires in an day
};

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

exports.User = mongoose.model("User", userSchema);
