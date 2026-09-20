const express = require("express");

const {
  getAssignmentPerformance,
} = require("../controllers/assignmentPerformanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Assignment Performance
router.get(
  "/student",
  protect,
  authorize("student"),
  getAssignmentPerformance
);

module.exports = router;