const express = require("express");

const {
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAcademicPerformance,
  getStudentAttendance,
} = require("../controllers/studentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student - view own profile
router.get(
  "/profile",
  protect,
  authorize("student"),
  getMyStudentProfile
);

// Faculty/Admin - get all students
router.get(
  "/",
  protect,
  authorize("faculty", "admin"),
  getAllStudents
);

// Faculty/Admin - get student's academic performance
router.get(
  "/:id/academic-performance",
  protect,
  authorize("faculty", "admin"),
  getStudentAcademicPerformance
);

// Faculty/Admin - get student's attendance
router.get(
  "/:id/attendance",
  protect,
  authorize("faculty", "admin"),
  getStudentAttendance
);

// Faculty/Admin - get one student
router.get(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  getStudentById
);

// Faculty/Admin - create student
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createStudent
);

// Faculty/Admin - update student
router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateStudent
);

// Admin - delete student
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

module.exports = router;