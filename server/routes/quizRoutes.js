const express = require("express");

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  attemptQuiz,
  getMyQuizAttempts,
} = require("../controllers/quizController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create Quiz
router.post(
  "/",
  protect,
  authorize("student"),
  createQuiz
);

// Get All Quizzes
router.get(
  "/",
  protect,
  getAllQuizzes
);

// Get My Quiz Attempts
router.get(
  "/my-attempts",
  protect,
  authorize("student"),
  getMyQuizAttempts
);

// Get Quiz by ID
router.get(
  "/:id",
  protect,
  getQuizById
);

// Attempt Quiz
router.post(
  "/attempt",
  protect,
  authorize("student"),
  attemptQuiz
);

module.exports = router;