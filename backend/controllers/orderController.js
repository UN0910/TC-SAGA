const { Order } = require("../models/orderModel");
const { User } = require("../models/userModel");
const { OrderItem } = require("../models/order-itemModel");
const nodemailer = require("nodemailer");

exports.getOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "userName email")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};

// exports.getCreatorsOrders = async (req, res) => {
//   const productList = await Product.findOne({ postedBy: req.params.id });

//   const orderItemsList = await OrderItem.find({ product: productList._id });
//   console.log(orderItemsList);

//   const orderList = await Order.findOne({ orderItems: orderItemsList._id });

//   if (!orderList) {
//     res.status(500).json({ success: false });
//   }
//   res.send(orderList);
// };

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "userName email")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
};

exports.addOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderitem) => {
      let newOrderItem = new OrderItem({
        quantity: orderitem.quantity,
        product: orderitem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );

      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    pincode: req.body.pincode,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  const userInfo = await User.findById(req.body.user);

  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.USER_NAME, // test user
      pass: process.env.USER_PASSWORD, // test password
    },
  });

  const mailOptions = {
    to: userInfo.email,
    from: '"TC-SAGA" <tcsaga0910@hotmail.com>',
    subject: "Order Placed",
    html: `<p>Hello, ${userInfo.userName}</p>
    <p>This is to inform you that your order with Order-ID ##${order._id} for your ${userInfo.email} account has been placed of ₹${totalPrice}.</p>
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

  if (!order) return res.status(400).send("the order cannot be created!");

  res.status(200).send(order);
};

exports.updateOrder = async (req, res) => {
  const orderInfo = await Order.findById(req.params.id);
  const user = await User.findById(orderInfo.user);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
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
    subject: "Order Update",
    html: `<p>Hello, ${user.userName}</p>
    <p>This is to inform you that the status your order with Order-ID ##${orderInfo._id} for your ${user.email} account has been updated to ${req.body.status}.</p>
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

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
};

exports.deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(order.user);

  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });

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
          subject: "Order Cancellation",
          html: `<p>Hello, ${user.userName}</p>
          <p>This is to inform you that your order with Order-ID ##${order._id} for your ${user.email} account has been cancelled.</p>
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

        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

exports.totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
};

exports.totalCount = async (req, res) => {
  const orderCount = await Order.countDocuments();

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
};

exports.userOrders = async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
};
