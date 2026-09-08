const express = require("express");
const router = express.Router();

const {
  submitAssignment,
  getMySubmissions,
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

module.exports = router;