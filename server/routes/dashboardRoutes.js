const express = require("express");

const {
  getStudentDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Student Dashboard
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentDashboard
);

module.exports = router;