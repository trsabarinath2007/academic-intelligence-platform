const express = require("express");
const router = express.Router();

const {
  submitAssignment,
  getMySubmissions,
  gradeSubmission,
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

// Grade Assignment Submission
router.put(
  "/:submissionId/grade",
  protect,
  gradeSubmission
);

module.exports = router;