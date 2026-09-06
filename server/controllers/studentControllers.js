const Student = require("../models/Student");

// Create Student Profile
const createStudentProfile = async (req, res) => {
  try {
    const { studentId, department, semester, section } = req.body;

    // Check required fields
    if (!studentId || !department || !semester) {
      return res.status(400).json({
        success: false,
        message: "Student ID, department and semester are required",
      });
    }

    // Check if student profile already exists
    const existingStudent = await Student.findOne({
      user: req.user._id,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists",
      });
    }

    // Check if student ID already exists
    const existingStudentId = await Student.findOne({
      studentId,
    });

    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: "Student ID already exists",
      });
    }

    // Create student profile
    const student = await Student.create({
      user: req.user._id,
      studentId,
      department,
      semester,
      section,
    });

    res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create student profile",
      error: error.message,
    });
  }
};

module.exports = {
  createStudentProfile,
};