const express = require("express");

const {
  registerUser,
  loginUser,
  resetUserPassword,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Reset User Password
// Only admin and faculty can reset passwords
router.put(
  "/reset-password",
  protect,
  authorize("admin", "faculty"),
  resetUserPassword
);

module.exports = router;