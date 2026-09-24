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
  getStudentQuizPerformance,
} = require("../controllers/studentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// STUDENT - VIEW OWN PROFILE
// ==========================================
router.get(
  "/profile",
  protect,
  authorize("student"),
  getMyStudentProfile
);

// ==========================================
// FACULTY / ADMIN - GET ALL STUDENTS
// ==========================================
router.get(
  "/",
  protect,
  authorize("faculty", "admin"),
  getAllStudents
);

// ==========================================
// FACULTY / ADMIN - ACADEMIC PERFORMANCE
// ==========================================
router.get(
  "/:id/academic-performance",
  protect,
  authorize("faculty", "admin"),
  getStudentAcademicPerformance
);

// ==========================================
// FACULTY / ADMIN - ATTENDANCE
// ==========================================
router.get(
  "/:id/attendance",
  protect,
  authorize("faculty", "admin"),
  getStudentAttendance
);

// ==========================================
// FACULTY / ADMIN - QUIZ PERFORMANCE
// ==========================================
router.get(
  "/:id/quiz-performance",
  protect,
  authorize("faculty", "admin"),
  getStudentQuizPerformance
);

// ==========================================
// FACULTY / ADMIN - GET ONE STUDENT
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  getStudentById
);

// ==========================================
// FACULTY / ADMIN - CREATE STUDENT
// ==========================================
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createStudent
);

// ==========================================
// FACULTY / ADMIN - UPDATE STUDENT
// ==========================================
router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateStudent
);

// ==========================================
// ADMIN - DELETE STUDENT
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

module.exports = router;