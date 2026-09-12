const express = require("express");

const {
  getStudentTrend,
} = require("../controllers/trendController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Student Performance Trend
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentTrend
);

module.exports = router;