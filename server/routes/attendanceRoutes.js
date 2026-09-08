const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Mark Attendance
router.post(
  "/",
  protect,
  markAttendance
);

// Get Student Attendance
router.get(
  "/student/:studentId",
  protect,
  getStudentAttendance
);

module.exports = router;