const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
var validate = require("validate.js");
const jwt = require("jsonwebtoken");

/////----- USER SIGNUP -----/////
exports.register = (req, res) => {
  const { email, password, userName } = req.body;

  let validation = validate(req.body, {
    email: {
      presence: true,
      email: true,
    },
    userName: {
      presence: true,
    },
    password: {
      presence: true,
    },
  });

  if (validation) {
    res.status(400).json({ error: validation, status: false });
    return console.log(validation);
  } else {
    User.findOne({ email: email }, async (err, result) => {
      if (err) {
        res.status(400).json({ error: err, status: false });
        return console.log("Error in finding the user");
      } else if (result) {
        res
          .status(400)
          .json({ error: "Email is already in use!", status: false });
        return console.log("Email already in use");
      } else {
        const hash = await bcryptjs.hash(password, 12);

        const user = new User({
          email: email,
          userName: userName,
          password: hash,
        });

        user.save((err, data) => {
          if (err) {
            console.log(err);
            res
              .status(400)
              .json({ error: "Error while saving user data!", status: false });
          } else {
            res
              .status(200)
              .json({ message: "User is Registered!", data, status: true });
          }
        });
      }
    });
  }
};

/////----- USER LOGIN -----/////
exports.login = (req, res) => {
  const { email, password } = req.body;
  let validation = validate(req.body, {
    email: {
      presence: true,
    },
    password: {
      presence: true,
    },
  });

  if (validation) {
    res.status(400).json({ error: validation });
    return console.log(validation);
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        bcryptjs
          .compare(password, user.password)
          .then((ifSame) => {
            if (ifSame) {
              res.json({
                message: "Logged-In",
                data: user,
                status: 200,
              });
            } else {
              res.status(400).json({ error: "Invalid password" });
            }
          })
          .catch((err) => {
            console.log("error in comparing password", err);
          });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  }
};

/////----- UPDATE PROFILE -----/////
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    let password = req.body.password;

    if (password) {
      req.body.password = await bcryptjs.hash(password, 12);
    }
    User.findOneAndUpdate({ _id }, req.body, (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        res
          .status(200)
          .json({ message: "Updated Successfully!", data: result });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

/////----- DELETE PROFILE -----/////
exports.delete = (req, res) => {
  try {
    const _id = req.params.id;

    User.findOneAndRemove({ _id }, (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        res.status(200).json({
          message: "Profile has been Deleted!",
          status: true,
          data: result,
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
