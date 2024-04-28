const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  logout,
  loginStatus,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getuser", protect, getUser);
router.get("/logout", logout);
router.get("/loggedin", loginStatus);

module.exports = router;
