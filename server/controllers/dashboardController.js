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

    res.status(200).json({
      success: true,
      message: "Student dashboard data fetched successfully",
      data: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,

        academicRecords: academicRecords.length,
        attendanceRecords: attendanceRecords.length,
        assignmentsSubmitted: assignmentSubmissions.length,
        quizzesAttempted: quizAttempts.length,
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