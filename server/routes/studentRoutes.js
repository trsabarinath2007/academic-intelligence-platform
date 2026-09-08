const express = require("express");

const {
  createStudentProfile,
  getStudentProfile,
} = require("../controllers/studentController");

const {
  getMyDashboard,
} = require("../controllers/studentDashboardController");

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

// Logged-in Student Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("student"),
  getMyDashboard
);

module.exports = router;