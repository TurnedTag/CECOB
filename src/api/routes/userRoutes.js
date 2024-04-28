const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getuser", protect, getUser);
module.exports = router;
