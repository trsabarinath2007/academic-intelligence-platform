const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");
const Student = require("../models/Student");


// Create Quiz
const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      questions,
      totalMarks,
      duration,
    } = req.body;

    // Validate fields
    if (
      !title ||
      !courseId ||
      !questions ||
      questions.length === 0 ||
      !totalMarks ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create quiz
    const quiz = await Quiz.create({
      title,
      description,
      course: courseId,
      questions,
      totalMarks,
      duration,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};


// Get All Quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("course", "courseCode courseName")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get quizzes",
      error: error.message,
    });
  }
};


// Get Quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("course", "courseCode courseName");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get quiz",
      error: error.message,
    });
  }
};


// Attempt Quiz
const attemptQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and answers are required",
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Find student
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check duplicate attempt
    const existingAttempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: student._id,
    });

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: "Quiz already attempted",
      });
    }

    // Calculate marks per question
    const marksPerQuestion =
      quiz.totalMarks / quiz.questions.length;

    let score = 0;

    // Evaluate answers
    answers.forEach((answer) => {
      const question = quiz.questions[answer.questionIndex];

      if (
        question &&
        question.correctAnswer === answer.selectedAnswer
      ) {
        score += marksPerQuestion;
      }
    });

    // Round score
    score = Number(score.toFixed(2));

    // Calculate percentage
    const percentage = Number(
      ((score / quiz.totalMarks) * 100).toFixed(2)
    );

    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
      quiz: quizId,
      student: student._id,
      answers,
      score,
      totalMarks: quiz.totalMarks,
      percentage,
    });

    res.status(201).json({
      success: true,
      message: "Quiz submitted and evaluated successfully",
      result: {
        score,
        totalMarks: quiz.totalMarks,
        percentage,
      },
      quizAttempt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};


module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  attemptQuiz,
};