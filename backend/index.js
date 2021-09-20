const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/config.env" });

const userRouter = require("./routes/userRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);

mongoose.connection.on("connected", () => {
  console.log("Connected to MONGO!!!");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MONGO... ", err);
});

app.listen(process.env.PORT, () => {
  console.log("Server Running at PORT", process.env.PORT);
});
