const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  createActivity,
  listActivities,
} = require("../controllers/activityController");

router.post("/activities", protect, createActivity);
router.get("/activities", protect, listActivities);

module.exports = router;
