const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  getActivity,
  likeActivity,
  createActivity,
  listActivities,
  presenceActivity,
  addCommentToActivity,
  listUserPresenceActivities,
  getTopActivitiesFromDistrict,
} = require("../controllers/activityController");

router.get("/activities", protect, listActivities);
router.post("/activities", protect, createActivity);
router.get("/activities/:id", protect, getActivity);
router.put("/activities/:id/like", protect, likeActivity);
router.put("/activities/:id/presence", protect, presenceActivity);
router.put("/activities/:id/comment", protect, addCommentToActivity);
router.get("/activities/presence/user", protect, listUserPresenceActivities);
router.get("/activities/top/district", protect, getTopActivitiesFromDistrict);

module.exports = router;
