const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
var validate = require("validate.js");
const nodemailer = require("nodemailer");
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
              service: "Gmail",
              auth: {
                user: process.env.USER_NAME,
                pass: process.env.USER_PASSWORD,
              },
            });

            const mailOptions = {
              to: user.email,
              from: '"TC-SAGA" <theTradingCardsSaga@example.com>',
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
          service: "Gmail",
          auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD,
          },
        });

        const mailOptions = {
          to: user.email,
          from: '"The TC-SAGA" <theTradingCardsSaga@example.com>',
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

        res.send("Account has been verified!!!");
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/////----- RESEND CONFIRMATION LINK -----/////
exports.resendEmail = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(400).send({
        msg: "We were unable to find a user with that email. Make sure your Email is correct!",
      });
    } else if (user.isVerified) {
      return res
        .status(200)
        .send("This account has been already verified. Please log in.");
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
            service: "Gmail",
            auth: {
              user: process.env.USER_NAME,
              pass: process.env.USER_PASSWORD,
            },
          });

          const mailOptions = {
            to: user.email,
            from: '"TC-SAGA" <theTradingCardsSaga@example.com>',
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
      if (!user.isVerified) {
        return res.status(400).json({
          message: "Your Email has not been verified. Please click on resend",
        });
      } else if (user) {
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
              service: "Gmail",
              auth: {
                user: process.env.USER_NAME, // test user
                pass: process.env.USER_PASSWORD, // test password
              },
            });

            const mailOptions = {
              to: user.email,
              from: '"TC-SAGA" <theTradingCardsSaga@example.com>',
              subject: "Password change request",
              html: `<!DOCTYPE html>

                <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                
                <head>
                  <title></title>
                  <meta charset="utf-8" />
                  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                  <!--[if !mso]><!-->
                  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
                  <!--<![endif]-->
                  <style>
                    * {
                      box-sizing: border-box;
                    }
                
                    th.column {
                      padding: 0
                    }
                
                    a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: inherit !important;
                    }
                
                    #MessageViewBody a {
                      color: inherit;
                      text-decoration: none;
                    }
                
                    p {
                      line-height: inherit
                    }
                
                    @media (max-width:740px) {
                      .icons-inner {
                        text-align: center;
                      }
                
                      .icons-inner td {
                        margin: 0 auto;
                      }
                
                      .row-content {
                        width: 100% !important;
                      }
                
                      .stack .column {
                        width: 100%;
                        display: block;
                      }
                    }
                  </style>
                </head>
                
                <body style="background-color: #37474f; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                    style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #37474f;" width="100%">
                    <tbody>
                      <tr>
                        <td>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                            role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                    class="row-content stack" role="presentation"
                                    style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #7f888c;"
                                    width="720">
                                    <tbody>
                                      <tr>
                                        <th class="column"
                                          style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;"
                                          width="100%">
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="image_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;padding-bottom:5px;">
                                                <div align="center" style="line-height:10px"><a
                                                    href="www.example.com" style="outline:none"
                                                    tabindex="-1" target="_blank"><img
                                                      alt="TRADING CARDS SAGA"
                                                      src="https://i.postimg.cc/QC2G3RXP/tc-saga-black.png"
                                                      style="display: block; height: auto; border: 0; width: 324px; max-width: 100%;"
                                                      title="TRADING CARDS SAGA"
                                                      width="324" /></a></div>
                                              </td>
                                            </tr>
                                          </table>
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                            role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                    class="row-content stack" role="presentation"
                                    style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #7f888c;"
                                    width="720">
                                    <tbody>
                                      <tr>
                                        <th class="column"
                                          style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;"
                                          width="100%">
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="image_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
                                                <div align="center" style="line-height:10px"><a
                                                    href="www.example.com" style="outline:none"
                                                    tabindex="-1" target="_blank"><img
                                                      alt="reset password"
                                                      src="https://i.postimg.cc/x8JDB0SM/reset-password.png"
                                                      style="display: block; height: auto; border: 0; width: 540px; max-width: 100%;"
                                                      title="reset password" width="540" /></a>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                            role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;"
                                            width="100%">
                                            <tr>
                                              <td
                                                style="padding-top:20px;padding-right:10px;padding-left:10px;">
                                                <div
                                                  style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                  <div
                                                    style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #292929; line-height: 1.2;">
                                                    <p style="margin: 0; text-align: center;"><span
                                                        style="font-size:16px;"><strong>Hello,
                                                          ${user.userName}</strong></span></p>
                                                    <p style="margin: 0; text-align: center;"><span
                                                        style="font-size:16px;"><strong>Click on
                                                          the below button to reset your
                                                          TC-SAGA password for your
                                                          ${user.email}
                                                          account.</strong></span></p>
                                                    <p
                                                      style="margin: 0; text-align: center; mso-line-height-alt: 16.8px;">
                                                      <br />
                                                    </p>
                                                    <p style="margin: 0; text-align: center;"><span
                                                        style="font-size:16px;"><strong>Thank
                                                          You,</strong></span></p>
                                                    <p style="margin: 0; text-align: center;"><span
                                                        style="font-size:16px;"><strong>Your
                                                          TC-SAGA Team</strong></span></p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="button_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td style="padding-bottom:10px;text-align:center;">
                                                <div align="center">
                                                  <!--[if mso]><a:roundrect xmlns:a="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:52px;width:107px;v-text-anchor:middle;" arcsize="91%" stroke="false" fillcolor="#000000"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#d6f8f2; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]--><a
                                                    href="${link}"
                                                    style="text-decoration:none;display:inline-block;color:#d6f8f2;background-color:#000000;border-radius:47px;width:auto;border-top:1px solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;border-left:1px solid #000000;padding-top:10px;padding-bottom:10px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                    target="_blank"><span
                                                      style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:3px;"><span
                                                        style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong>RESET</strong></span></span></a>
                                                  <!--[if mso]></center></v:textbox></a:roundrect><![endif]-->
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                            role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;"
                                            width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                <div
                                                  style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                  <div
                                                    style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; line-height: 1.2;">
                                                    <p
                                                      style="margin: 0; text-align: center; font-size: 16px;">
                                                      <span style="font-size:16px;">We received a
                                                        request to reset your password.</span>
                                                    </p>
                                                    <p
                                                      style="margin: 0; text-align: center; font-size: 16px;">
                                                      <span style="font-size:16px;">If you didn't
                                                        make this request, simply ignore this
                                                        email.</span>
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                            role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                                    class="row-content stack" role="presentation"
                                    style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #000;"
                                    width="720">
                                    <tbody>
                                      <tr>
                                        <th class="column"
                                          style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;"
                                          width="33.333333333333336%">
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="image_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:30px;padding-left:25px;padding-right:25px;padding-top:50px;width:100%;">
                                                <div align="center" style="line-height:10px"><a
                                                    href="www.example.com" style="outline:none"
                                                    tabindex="-1" target="_blank"><img
                                                      alt="company logo"
                                                      src="https://i.postimg.cc/T2FXgWr9/tc-saga-white.png"
                                                      style="display: block; height: auto; border: 0; width: 166px; max-width: 100%;"
                                                      title="company logo" width="166" /></a>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                        </th>
                                        <th class="column"
                                          style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;"
                                          width="33.333333333333336%">
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="heading_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                                                <h3
                                                  style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 16px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;">
                                                  <strong>About Us</strong>
                                                </h3>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="10" cellspacing="0"
                                            class="divider_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td>
                                                <table border="0" cellpadding="0" cellspacing="0"
                                                  role="presentation"
                                                  style="mso-table-lspace: 0; mso-table-rspace: 0;"
                                                  width="80%">
                                                  <tr>
                                                    <td class="divider_inner"
                                                      style="font-size: 1px; line-height: 1px; border-top: 2px solid #BBBBBB;">
                                                      <span></span>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                            role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;"
                                            width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                <div
                                                  style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                  <div
                                                    style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #ffffff; line-height: 1.5;">
                                                    <p
                                                      style="margin: 0; font-size: 14px; mso-line-height-alt: 18px;">
                                                      <span style="font-size:12px;">The
                                                        relationship can begin to crumble and
                                                        they might soon be back where they were.
                                                        Or, one could end up putting up with
                                                        what is taking place, and they will end
                                                        up feeling even worse. <br /></span>
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                        </th>
                                        <th class="column"
                                          style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;"
                                          width="33.333333333333336%">
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="heading_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                                                <h3
                                                  style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 16px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;">
                                                  <strong>Contact</strong>
                                                </h3>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="10" cellspacing="0"
                                            class="divider_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td>
                                                <table border="0" cellpadding="0" cellspacing="0"
                                                  role="presentation"
                                                  style="mso-table-lspace: 0; mso-table-rspace: 0;"
                                                  width="80%">
                                                  <tr>
                                                    <td class="divider_inner"
                                                      style="font-size: 1px; line-height: 1px; border-top: 2px solid #BBBBBB;">
                                                      <span></span>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                            role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;"
                                            width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                <div
                                                  style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                  <div
                                                    style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #a9a9a9; line-height: 1.2;">
                                                    <p style="margin: 0; font-size: 12px;"><span
                                                        style="font-size:14px;"><strong>help@tcsaga.com</strong></span>
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                                            role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;"
                                            width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                <div
                                                  style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                                  <div
                                                    style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #a9a9a9; line-height: 1.2;">
                                                    <p style="margin: 0; font-size: 14px;">
                                                      <strong>INDORE</strong>
                                                    </p>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                          <table border="0" cellpadding="0" cellspacing="0"
                                            class="social_block" role="presentation"
                                            style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
                                            <tr>
                                              <td
                                                style="padding-bottom:35px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
                                                <table align="left" border="0" cellpadding="0"
                                                  cellspacing="0" class="social-table"
                                                  role="presentation"
                                                  style="mso-table-lspace: 0; mso-table-rspace: 0;"
                                                  width="156px">
                                                  <tr>
                                                    <td style="padding:0 20px 0 0;"><a
                                                        href="https://www.facebook.com/"
                                                        target="_blank"><img alt="Facebook"
                                                          height="32"
                                                          src="https://i.postimg.cc/s2mrh6cQ/facebook2x.png"
                                                          style="display: block; height: auto; border: 0;"
                                                          title="facebook" width="32" /></a>
                                                    </td>
                                                    <td style="padding:0 20px 0 0;"><a
                                                        href="https://www.twitter.com/"
                                                        target="_blank"><img alt="Twitter"
                                                          height="32"
                                                          src="https://i.postimg.cc/V6HP7J2z/twitter2x.png"
                                                          style="display: block; height: auto; border: 0;"
                                                          title="twitter" width="32" /></a>
                                                    </td>
                                                    <td style="padding:0 20px 0 0;"><a
                                                        href="https://www.instagram.com/"
                                                        target="_blank"><img alt="Instagram"
                                                          height="32"
                                                          src="https://i.postimg.cc/W34P6GW9/instagram2x.png"
                                                          style="display: block; height: auto; border: 0;"
                                                          title="instagram" width="32" /></a>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table><!-- End -->
                </body>
                
                </html>`,
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

            res.send("Email Sent!");
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
          service: "Gmail",
          auth: {
            user: "tcsaga0910@gmail.com", // test user
            pass: "8602782075", // test password
          },
        });

        const mailOptions = {
          to: user.email,
          from: '"The TC-SAGA" <theTradingCardsSaga@example.com>',
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

        res.send("Password has been updated!!!");
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/////----- CONFIRM EMAIL -----/////
