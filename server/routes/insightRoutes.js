const express = require("express");

const {
  getStudentInsights,
} = require("../controllers/insightController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Student Performance Insights
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentInsights
);

module.exports = router;