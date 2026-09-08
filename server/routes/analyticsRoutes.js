const express = require("express");
const router = express.Router();

const {
  getStudentAnalytics,
  getStudentDashboard,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

// Student Performance Analytics
router.get(
  "/student/:studentId",
  protect,
  getStudentAnalytics
);

// Complete Student Dashboard
router.get(
  "/dashboard/:studentId",
  protect,
  getStudentDashboard
);

module.exports = router;