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

const User = new mongoose.model("User", userSchema);
module.exports = User;
