const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  createActivity,
  listActivities,
  getActivity,
} = require("../controllers/activityController");

router.post("/activities", protect, createActivity);
router.get("/activities", protect, listActivities);

router.get("/activities/:id", protect, getActivity);

module.exports = router;
