const express = require("express");

const {
  getOverallPerformance,
} = require("../controllers/adminAnalyticsController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get overall student performance
router.get(
  "/overall-performance",
  protect,
  authorize("admin", "faculty"),
  getOverallPerformance
);

module.exports = router;