const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
require("dotenv").config({ path: "./config/config.env" });

const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productsRoute");
const categoryRouter = require("./routes/categoriesRoute");
const contactRouter = require("./routes/contactRoute");
const orderRouter = require("./routes/ordersRoute");
const wishlistRouter = require("./routes/wishlistRoute");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/contact", contactRouter);
app.use("/order", orderRouter);
app.use("/wishlist", wishlistRouter);

mongoose.connection.on("connected", () => {
  console.log("Connected to MONGO!!!");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MONGO... ", err);
});

app.listen(process.env.PORT, () => {
  console.log("Server Running at PORT", process.env.PORT);
});
