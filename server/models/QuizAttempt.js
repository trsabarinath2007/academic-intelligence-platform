const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },

        selectedAnswer: {
          type: Number,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from attempting the same quiz multiple times
quizAttemptSchema.index(
  { quiz: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);