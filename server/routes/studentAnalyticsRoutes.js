const express = require("express");

const {
  getStudentAnalytics,
} = require("../controllers/studentAnalyticsController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Complete Student Analytics
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentAnalytics
);

module.exports = router;