const Student = require("../models/Student");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const QuizAttempt = require("../models/QuizAttempt");

// Get Student Dashboard
const getStudentDashboard = async (req, res) => {
  try {
    // Find logged-in student's profile
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Get academic records
    const academicRecords = await AcademicRecord.find({
      student: student._id,
    }).populate("course", "courseCode courseName credits");

    // Get attendance records
    const attendanceRecords = await Attendance.find({
      student: student._id,
    });

    // Get assignment submissions
    const assignmentSubmissions = await AssignmentSubmission.find({
      student: student._id,
    });

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.find({
      student: student._id,
    });

    // =========================
    // CALCULATE GPA
    // =========================

    const gradePoints = {
      "A+": 10,
      A: 9,
      "B+": 8,
      B: 7,
      "C+": 6,
      C: 5,
      D: 4,
      F: 0,
    };

    let totalCredits = 0;
    let totalWeightedPoints = 0;

    academicRecords.forEach((record) => {
      if (record.course) {
        const credits = record.course.credits;
        const gradePoint = gradePoints[record.grade] || 0;

        totalCredits += credits;
        totalWeightedPoints += gradePoint * credits;
      }
    });

    const gpa =
      totalCredits > 0
        ? Number((totalWeightedPoints / totalCredits).toFixed(2))
        : 0;

    // =========================
    // CALCULATE ATTENDANCE
    // =========================

    const totalClasses = attendanceRecords.length;

    const presentClasses = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? Number(
            ((presentClasses / totalClasses) * 100).toFixed(2)
          )
        : 0;

    // =========================
    // CALCULATE AVERAGE QUIZ SCORE
    // =========================

    let averageQuizPercentage = 0;

    if (quizAttempts.length > 0) {
      const totalQuizPercentage = quizAttempts.reduce(
        (sum, attempt) => sum + attempt.percentage,
        0
      );

      averageQuizPercentage = Number(
        (totalQuizPercentage / quizAttempts.length).toFixed(2)
      );
    }

    // =========================
    // PERFORMANCE STATUS
    // =========================

    let performanceStatus;

    if (gpa >= 9) {
      performanceStatus = "Excellent";
    } else if (gpa >= 7) {
      performanceStatus = "Good";
    } else if (gpa >= 5) {
      performanceStatus = "Average";
    } else {
      performanceStatus = "Needs Improvement";
    }

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      success: true,
      message: "Student dashboard data fetched successfully",

      data: {
        student: {
          studentId: student.studentId,
          department: student.department,
          semester: student.semester,
        },

        academics: {
          totalSubjects: academicRecords.length,
          gpa,
          performanceStatus,
        },

        attendance: {
          totalClasses,
          presentClasses,
          attendancePercentage,
        },

        assignments: {
          submitted: assignmentSubmissions.length,
        },

        quizzes: {
          attempted: quizAttempts.length,
          averagePercentage: averageQuizPercentage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
};