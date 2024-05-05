const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  createActivity,
  listActivities,
  getActivity,
  likeActivity,
} = require("../controllers/activityController");

router.post("/activities", protect, createActivity);
router.get("/activities", protect, listActivities);

router.get("/activities/:id", protect, getActivity);
router.put("/activities/:id/like", protect, likeActivity);

module.exports = router;
