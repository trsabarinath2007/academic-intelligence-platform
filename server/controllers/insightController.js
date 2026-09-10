const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Student = require("../models/Student");

// Get Student Performance Insights
const getStudentInsights = async (req, res) => {
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

    // Fetch data
    const academicRecords = await AcademicRecord.find({
      student: student._id,
    }).populate("course", "courseCode courseName");

    const attendanceRecords = await Attendance.find({
      student: student._id,
    });

    const quizAttempts = await QuizAttempt.find({
      student: student._id,
    });

    const assignmentSubmissions = await AssignmentSubmission.find({
      student: student._id,
    });

    // -------------------------
    // Academic Analysis
    // -------------------------

    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    academicRecords.forEach((record) => {
      if (record.totalMarks >= 80) {
        strengths.push(
          `${record.course.courseName} - ${record.totalMarks} marks`
        );
      }

      if (record.totalMarks < 70) {
        weaknesses.push(
          `${record.course.courseName} - ${record.totalMarks} marks`
        );
      }
    });

    // -------------------------
    // Attendance Analysis
    // -------------------------

    const totalClasses = attendanceRecords.length;

    const presentClasses = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? (presentClasses / totalClasses) * 100
        : 0;

    if (attendancePercentage < 75) {
      weaknesses.push(
        `Attendance is low at ${attendancePercentage.toFixed(2)}%`
      );

      recommendations.push(
        "Improve attendance and maintain at least 75% attendance."
      );
    } else {
      strengths.push(
        `Good attendance - ${attendancePercentage.toFixed(2)}%`
      );
    }

    // -------------------------
    // Quiz Analysis
    // -------------------------

    if (quizAttempts.length > 0) {
      const totalQuizPercentage = quizAttempts.reduce(
        (sum, attempt) => sum + attempt.percentage,
        0
      );

      const averageQuizPercentage =
        totalQuizPercentage / quizAttempts.length;

      if (averageQuizPercentage >= 75) {
        strengths.push(
          `Good quiz performance - ${averageQuizPercentage.toFixed(2)}% average`
        );
      } else {
        weaknesses.push(
          `Quiz performance is ${averageQuizPercentage.toFixed(2)}%`
        );

        recommendations.push(
          "Practice more quiz questions to improve conceptual understanding."
        );
      }
    }

    // -------------------------
    // Assignment Analysis
    // -------------------------

    if (assignmentSubmissions.length === 0) {
      recommendations.push(
        "Complete and submit pending assignments regularly."
      );
    } else {
      strengths.push(
        `${assignmentSubmissions.length} assignment(s) submitted`
      );
    }

    // -------------------------
    // General Recommendations
    // -------------------------

    if (weaknesses.length > 0) {
      recommendations.push(
        "Focus more study time on subjects with lower marks."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain your current academic performance."
      );
    }

    // -------------------------
    // Response
    // -------------------------

  res.status(200).json({
  success: true,
  student: {
    studentId: student.studentId,
    department: student.department,
    semester: student.semester,
  },

  insights: {
    strengths,
    weaknesses,
    recommendations,

    summary: {
      academicRecords: academicRecords.length,
      attendancePercentage: Number(
        attendancePercentage.toFixed(2)
      ),
      quizzesAttempted: quizAttempts.length,
      assignmentsSubmitted: assignmentSubmissions.length,
    },
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate performance insights",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentInsights,
};