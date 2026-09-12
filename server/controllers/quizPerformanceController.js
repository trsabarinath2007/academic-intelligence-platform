
const QuizAttempt = require("../models/QuizAttempt");
const Student = require("../models/Student");

// Get Quiz-Wise Performance
const getQuizPerformance = async (req, res) => {
  try {
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

    // Get quiz attempts
    const attempts = await QuizAttempt.find({
      student: student._id,
    }).populate({
      path: "quiz",
      select: "title totalMarks duration",
      populate: {
        path: "course",
        select: "courseCode courseName",
      },
    });

    const quizPerformance = attempts.map((attempt) => {
      let performanceLevel;

      if (attempt.percentage >= 85) {
        performanceLevel = "Excellent";
      } else if (attempt.percentage >= 75) {
        performanceLevel = "Good";
      } else if (attempt.percentage >= 60) {
        performanceLevel = "Average";
      } else {
        performanceLevel = "Needs Improvement";
      }

      return {
        quizTitle: attempt.quiz
          ? attempt.quiz.title
          : null,

        courseCode:
          attempt.quiz && attempt.quiz.course
            ? attempt.quiz.course.courseCode
            : null,

        courseName:
          attempt.quiz && attempt.quiz.course
            ? attempt.quiz.course.courseName
            : null,

        score: attempt.score,

        totalMarks: attempt.totalMarks,

        percentage: attempt.percentage,

        performanceLevel,

        attemptedAt: attempt.attemptedAt,
      };
    });

    // Calculate average
    let averagePercentage = 0;

    if (quizPerformance.length > 0) {
      const totalPercentage = quizPerformance.reduce(
        (sum, quiz) => sum + quiz.percentage,
        0
      );

      averagePercentage = Number(
        (
          totalPercentage / quizPerformance.length
        ).toFixed(2)
      );
    }

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      summary: {
        quizzesAttempted: quizPerformance.length,
        averagePercentage,
      },

      quizPerformance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz performance",
      error: error.message,
    });
  }
};

module.exports = {
  getQuizPerformance,
};