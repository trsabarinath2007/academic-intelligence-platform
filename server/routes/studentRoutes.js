const express = require("express");

const {
  createStudentProfile,
  getStudentProfile,
} = require("../controllers/studentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create Student Profile
router.post(
  "/profile",
  protect,
  authorize("student"),
  createStudentProfile
);

// Get Student Profile
router.get(
  "/profile",
  protect,
  authorize("student"),
  getStudentProfile
);

module.exports = router;