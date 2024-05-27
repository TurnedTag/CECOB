const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  getEnhancement,
  likeEnhancement,
  listEnhancements,
  createEnhancement,
} = require("../controllers/enhancementController");

router.get("/enhancements", protect, listEnhancements);
router.post("/enhancements", protect, createEnhancement);
router.get("/enhancements/:id", protect, getEnhancement);
router.put("/enhancements/:id/like", protect, likeEnhancement);

module.exports = router;
