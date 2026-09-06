const express = require("express");

const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Courses - Any Logged-in User
router.get("/", protect, getAllCourses);

// Create Course - Admin Only
router.post(
  "/",
  protect,
  authorize("admin"),
  createCourse
);

module.exports = router;