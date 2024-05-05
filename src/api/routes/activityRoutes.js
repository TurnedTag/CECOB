const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createActivity } = require("../controllers/activityController");

router.post("/activities", protect, createActivity);

module.exports = router;
