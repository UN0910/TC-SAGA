const { User } = require("../models/userModel");
const bcryptjs = require("bcryptjs");
var validate = require("validate.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/////----- USERS LIST -----/////
exports.getUsers = async (req, res) => {
  const userList = await User.find().select("-password");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
};

/////----- ADMIN LIST -----/////
exports.getAdmins = async (req, res) => {
  const adminList = await User.find({ userRole: "ADMIN" }).select("-password");

  if (!adminList) {
    res.status(500).json({ success: false });
  }
  res.send(adminList);
};

/////----- CREATOR LIST -----/////
exports.getCreators = async (req, res) => {
  const creatorList = await User.find({ userRole: "CREATOR" }).select(
    "-password"
  );

  if (!creatorList) {
    res.status(500).json({ success: false });
  }
  res.send(creatorList);
};

/////----- GET USER -----/////
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
};

/////----- ADD USER -----/////
exports.addUser = async (req, res) => {
  let user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, 12),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    pincode: req.body.pincode,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
};

/////----- UPDATE PROFILE -----/////
exports.update = async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = await bcryptjs.hashSync(req.body.password, 12);
  } else {
    newPassword = userExist.password;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      userName: req.body.userName,
      email: req.body.email,
      password: newPassword,
      phone: req.body.phone,
      isVerified: req.body.isVerified,
      userRole: req.body.userRole,
      street: req.body.street,
      apartment: req.body.apartment,
      pincode: req.body.pincode,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
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

/////----- REGISTER -----/////
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
        const hash = await bcryptjs.hashSync(password, 12);

        const user = new User({
          email: email,
          userName: userName,
          password: hash,
        });

        user.generateVerifiedToken();

        user.save((err, data) => {
          if (err) {
            console.log(err);
            res
              .status(400)
              .json({ error: "Error while saving user data!", status: false });
          } else {
            let link =
              "http://" +
              req.headers.host +
              "/user/confirm-email/" +
              user.verifiedToken;

            let transporter = nodemailer.createTransport({
              service: "hotmail",
              auth: {
                user: process.env.USER_NAME,
                pass: process.env.USER_PASSWORD,
              },
            });

            const mailOptions = {
              to: user.email,
              from: '"TC-SAGA" <tcsaga0910@hotmail.com>',
              subject: "Email Verfication",
              html: `<p>Hello, ${user.userName}</p>
                <p>Click on this link to verify your TC-SAGA account for your ${user.email} account.</p>
                <p>${link}</p>
                <p>Thanks,</p>
                <p>Your TC-SAGA team</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              res.status(200).json({
                message:
                  "A Verification email has been sent to " + user.email + ".",
              });
              console.log("Message sent: %s", info.messageId);
            });
            res
              .status(200)
              .json({ message: "User is Registered!", data, status: true });
          }
        });
      }
    });
  }
};

/////----- CONFIRM EMAIL -----/////
exports.confirmEmail = (req, res) => {
  User.findOne({
    verifiedToken: req.params.token,
    verifiedTokenExpires: { $gt: Date.now() },
  })
    .then(async (user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Verification token is invalid or has expired." });

      user.isVerified = true;
      user.verifiedToken = undefined;
      user.verifiedTokenExpires = undefined;

      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });

        // send email
        let transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD,
          },
        });

        const mailOptions = {
          to: user.email,
          from: '"The TC-SAGA" <tcsaga0910@hotmail.com>',
          subject: "Your account has been verified",
          html: `<p>Hello, ${user.userName}</p>
                    <p>This is a confirmation that your account ${user.email} has just been verified!</p>
                    <p>Thanks,</p>
                    <p>Your TC-SAGA team</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
        res.render("accountVerified");
        // res.send("Account has been verified!!!");
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/////----- RESEND CONFIRMATION LINK -----/////
exports.resendEmail = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(400).json({
        error:
          "We were unable to find a user with that email. Make sure your Email is correct!",
        status: false,
      });
    } else if (user.isVerified) {
      return res.status(400).json({
        error: "This account is already verified. Please log in.",
        status: false,
      });
    } else {
      user.generateVerifiedToken();

      user.save((err, data) => {
        if (err) {
          console.log(err);
          res
            .status(400)
            .json({ error: "Error while saving user data!", status: false });
        } else {
          let link =
            "http://" +
            req.headers.host +
            "/user/confirm-email/" +
            user.verifiedToken;

          let transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
              user: process.env.USER_NAME,
              pass: process.env.USER_PASSWORD,
            },
          });

          const mailOptions = {
            to: user.email,
            from: '"TC-SAGA" <tcsaga0910@hotmail.com>',
            subject: "Email Verfication",
            html: `<p>Hello, ${user.userName}</p>
                <p>Click on this link to verify your TC-SAGA account for your ${user.email} account.</p>
                <p>${link}</p>
                <p>If you didn’t ask to verify your account, you can ignore this email.</p>
                <p>Thanks,</p>
                <p>Your TC-SAGA team</p>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            res.status(200).json({
              message:
                "A Verification email has been sent to " + user.email + ".",
            });
            console.log("Message sent: %s", info.messageId);
          });
          res
            .status(200)
            .json({ message: "Verification Link sent!", data, status: true });
        }
      });
    }
  });
};

/////----- USER LOGIN -----/////
exports.login = async (req, res) => {
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
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET;

    if (!user) {
      return res
        .status(400)
        .json({ error: "The user not found", status: false });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ error: "Your account is not verified!!!", status: false });
    }

    if (user && bcryptjs.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userId: user.id,
          user: user,
          userRole: user.userRole,
        },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).json({ error: "Wrong Password!!!", status: false });
    }
  }
};

/////-----  FORGOT PASSWORD -----/////
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  let validation = validate(req.body, {
    email: {
      presence: true,
      email: true,
    },
  });

  if (validation) {
    res.status(400).json({ error: validation });
    return console.log(validation);
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (!user)
          return res
            .status(401)
            .json({ error: "User not found of " + email + " address" });

        user.generatePasswordReset();

        user
          .save()
          .then((user) => {
            // send email
            let link =
              "http://" +
              req.headers.host +
              "/user/reset-password/" +
              user.resetPasswordToken;

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
              subject: "Password change request",
              html: `<p>Hello, ${user.userName}</p>
              <p>Follow this link to reset your TC-SAGA account password for your ${user.email} account.</p>
              <p>${link}</p>
              <p>If you didn’t ask to reset your password, you can ignore this email.</p>
              <p>Thanks,</p>
              <p>Your TC-SAGA team</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              res.status(200).json({
                message: "A reset email has been sent to " + user.email + ".",
              });
              console.log("Message sent: %s", info.messageId);
            });

            res.status(200).json({
              message: "A reset email has been sent to " + user.email + ".",
            });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  }
};

/////----- RESET -----/////
exports.reset = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Redirect user to form with the email address
      res.render("reset", { token: req.params.token });
      // res.status(200).json({ user: user, token: req.params.token });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/////----- RESET PASSWORD -----/////
exports.resetPassword = async (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then(async (user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      user.password = await bcryptjs.hash(req.body.password, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });

        // send email
        let transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
            user: process.env.USER_NAME, // test user
            pass: process.env.USER_PASSWORD, // test password
          },
        });

        const mailOptions = {
          to: user.email,
          from: '"The TC-SAGA" <tcsaga0910@hotmail.com>',
          subject: "Your password has been changed",
          html: `<p>Hello, ${user.userName}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
                    <p>Thanks,</p>
                    <p>Your TC-SAGA team</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });

        // res.send("Password has been updated!!!");
        res.render("passwordChanged");
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/////----- TOTAL USER COUNT -----/////
exports.totalCount = async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
};
