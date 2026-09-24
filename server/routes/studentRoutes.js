const express = require("express");

const {
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Logged-in student's own profile
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

// Faculty/Admin - get one student
router.get(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  getStudentById
);

// Admin/Faculty - create student
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createStudent
);

// Admin/Faculty - update student
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