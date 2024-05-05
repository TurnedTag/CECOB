const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const userRoutes = require("./api/routes/userRoutes");
const activityRoutes = require("./api/routes/activityRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api", activityRoutes);

module.exports = app;
