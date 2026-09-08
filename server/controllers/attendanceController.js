const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;

    // Validate fields
    if (!studentId || !courseId || !status) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Course ID and status are required",
      });
    }

    // Validate status
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Present or Absent",
      });
    }

    // Check student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
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

    // Create attendance
    const attendance = await Attendance.create({
      student: studentId,
      course: courseId,
      date: date || new Date(),
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    // Duplicate attendance error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Attendance already marked for this student and course on this date",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Get Student Attendance
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({
      student: studentId,
    })
      .populate("course", "courseCode courseName")
      .sort({ date: -1 });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found",
      });
    }

    const totalClasses = attendance.length;

    const presentClasses = attendance.filter(
      (record) => record.status === "Present"
    ).length;

    const absentClasses = attendance.filter(
      (record) => record.status === "Absent"
    ).length;

    const attendancePercentage = Number(
      ((presentClasses / totalClasses) * 100).toFixed(2)
    );

    res.status(200).json({
      success: true,

      summary: {
        totalClasses,
        presentClasses,
        absentClasses,
        attendancePercentage,
      },

      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get attendance",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
};