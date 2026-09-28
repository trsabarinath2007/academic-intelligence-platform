const express = require("express");

const {
  generateAIQuiz,
} = require("../controllers/aiQuizController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorize("faculty", "admin"),
  generateAIQuiz
);

module.exports = router;