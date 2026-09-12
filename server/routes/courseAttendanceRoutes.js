const express = require("express");

const {
  getCourseAttendance,
} = require("../controllers/courseAttendanceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Course-Wise Attendance
router.get(
  "/student",
  protect,
  authorize("student"),
  getCourseAttendance
);

module.exports = router;