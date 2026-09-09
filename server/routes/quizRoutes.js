const express = require("express");

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  attemptQuiz,
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
  createQuiz
);


// Get All Quizzes
router.get(
  "/",
  protect,
  getAllQuizzes
);


// Get Quiz By ID
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