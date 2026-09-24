const express = require("express");

const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get All Courses - Any Logged-in User
router.get(
  "/",
  protect,
  getAllCourses
);


// Create Course - Admin Only
router.post(
  "/",
  protect,
  authorize("admin"),
  createCourse
);


// Update Course - Admin Only
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCourse
);


// Delete Course - Admin Only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCourse
);


module.exports = router;