const express = require("express");

const {
  getAssignmentPerformance,
} = require("../controllers/assignmentPerformanceController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in student's assignment performance
router.get(
  "/student",
  protect,
  getAssignmentPerformance
);

module.exports = router;