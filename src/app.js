const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

module.exports = app;
