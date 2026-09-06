const Student = require("../models/Student");

// Create Student Profile
const createStudentProfile = async (req, res) => {
  try {
    const { studentId, department, semester, section } = req.body;

    if (!studentId || !department || !semester) {
      return res.status(400).json({
        success: false,
        message: "Student ID, department and semester are required",
      });
    }

    const existingStudent = await Student.findOne({
      user: req.user._id,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists",
      });
    }

    const existingStudentId = await Student.findOne({
      studentId,
    });

    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: "Student ID already exists",
      });
    }

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


// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user._id,
    }).populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get student profile",
      error: error.message,
    });
  }
};


// Export both functions at the END
module.exports = {
  createStudentProfile,
  getStudentProfile,
};