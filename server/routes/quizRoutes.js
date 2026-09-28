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

// ==========================================
// CREATE QUIZ
// Faculty/Admin can create quizzes
// ==========================================

router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createQuiz
);

// ==========================================
// GET ALL QUIZZES
// Faculty/Admin/Student can view quizzes
// ==========================================

router.get(
  "/",
  protect,
  getAllQuizzes
);

// ==========================================
// GET MY QUIZ ATTEMPTS
// Student only
// ==========================================

router.get(
  "/my-attempts",
  protect,
  authorize("student"),
  getMyQuizAttempts
);

// ==========================================
// GET QUIZ BY ID
// Authenticated users
// ==========================================

router.get(
  "/:id",
  protect,
  getQuizById
);

// ==========================================
// ATTEMPT QUIZ
// Student only
// ==========================================

router.post(
  "/attempt",
  protect,
  authorize("student"),
  attemptQuiz
);

module.exports = router;