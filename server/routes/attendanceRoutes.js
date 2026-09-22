const express = require("express");

const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  authorize,
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

// Get All Attendance - Faculty/Admin
router.get(
  "/",
  protect,
  authorize("faculty", "admin"),
  getAllAttendance
);

module.exports = router;