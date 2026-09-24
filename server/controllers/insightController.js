const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Student = require("../models/Student");

// Generate performance insights for a student
const generateStudentInsights = async (student) => {
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

  const assignmentSubmissions =
    await AssignmentSubmission.find({
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
        `${record.course?.courseName || "Subject"} - ${record.totalMarks} marks`
      );
    }

    if (record.totalMarks < 70) {
      weaknesses.push(
        `${record.course?.courseName || "Subject"} - ${record.totalMarks} marks`
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

  let averageQuizPercentage = 0;

  if (quizAttempts.length > 0) {
    const totalQuizPercentage = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.percentage,
      0
    );

    averageQuizPercentage =
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

  return {
    strengths,
    weaknesses,
    recommendations,

    summary: {
      academicRecords: academicRecords.length,
      attendancePercentage: Number(
        attendancePercentage.toFixed(2)
      ),
      quizzesAttempted: quizAttempts.length,
      assignmentsSubmitted:
        assignmentSubmissions.length,
    },
  };
};

// ==========================================
// STUDENT - GET OWN PERFORMANCE INSIGHTS
// ==========================================

const getStudentInsights = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const insights = await generateStudentInsights(
      student
    );

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      insights,
    });
  } catch (error) {
    console.error(
      "Get student insights error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate performance insights",
      error: error.message,
    });
  }
};

// ==========================================
// FACULTY / ADMIN - GET SPECIFIC STUDENT INSIGHTS
// ==========================================

const getStudentInsightsById = async (req, res) => {
  try {
    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const insights = await generateStudentInsights(
      student
    );

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        section: student.section,
      },

      insights,
    });
  } catch (error) {
    console.error(
      "Get student insights by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate performance insights",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentInsights,
  getStudentInsightsById,
};