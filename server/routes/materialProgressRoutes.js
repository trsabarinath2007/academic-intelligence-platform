const express = require("express");

const {
  markMaterialCompleted,
  getStudentMaterialProgress,
  getStudentCourseMaterialProgress,
} = require("../controllers/materialProgressController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Mark learning material as completed
router.put(
  "/:materialId/complete",
  protect,
  authorize("student"),
  markMaterialCompleted
);

// Get logged-in student's material progress
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentMaterialProgress
);

// Get course-wise material progress
router.get(
  "/student/course-summary",
  protect,
  authorize("student"),
  getStudentCourseMaterialProgress
);

module.exports = router;