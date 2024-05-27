const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  getHighlight,
  likeHighlight,
  listHighlights,
  createHighlight,
} = require("../controllers/highlightController");

router.get("/highlights", protect, listHighlights);
router.post("/highlights", protect, createHighlight);
router.get("/highlights/:id", protect, getHighlight);
router.put("/highlights/:id/like", protect, likeHighlight);

module.exports = router;
