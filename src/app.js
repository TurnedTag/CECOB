const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("./api/routes/userRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);

module.exports = app;
