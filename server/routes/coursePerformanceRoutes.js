const express = require("express");

const {
  getCoursePerformance,
} = require("../controllers/coursePerformanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Course-Wise Performance
router.get(
  "/student",
  protect,
  authorize("student"),
  getCoursePerformance
);

module.exports = router;