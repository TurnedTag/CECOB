const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  logout,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getuser", protect, getUser);
router.get("/logout", logout);

module.exports = router;
