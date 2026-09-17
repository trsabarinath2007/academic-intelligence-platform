const express = require("express");

const {
  getQuizPerformance,
} = require("../controllers/quizPerformanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Quiz-Wise Performance
router.get(
  "/student",
  protect,
  authorize("student"),
  getQuizPerformance
);

module.exports = router;