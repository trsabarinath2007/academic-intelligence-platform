const express = require("express");

const router = express.Router();

const {
  submitAssignment,
  getMySubmissions,
  gradeSubmission,
  getAllSubmissions,
} = require("../controllers/assignmentSubmissionController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Submit Assignment
router.post(
  "/",
  protect,
  authorize("student"),
  submitAssignment
);

// Get My Submissions
router.get(
  "/my-submissions",
  protect,
  authorize("student"),
  getMySubmissions
);

// Get All Submissions - Faculty/Admin
router.get(
  "/",
  protect,
  authorize("faculty", "admin"),
  getAllSubmissions
);

// Grade Assignment Submission
router.put(
  "/:submissionId/grade",
  protect,
  authorize("faculty", "admin"),
  gradeSubmission
);

module.exports = router;