const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./api/routes/userRoutes");
const activityRoutes = require("./api/routes/activityRoutes");
const highlightRoutes = require("./api/routes/highlightRoutes");
const enhancementRoutes = require("./api/routes/enhancementRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api", highlightRoutes);
app.use("/api", enhancementRoutes);
app.use("/api", activityRoutes);

module.exports = app;
