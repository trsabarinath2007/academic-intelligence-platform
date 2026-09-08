const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// Create Assignment
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      dueDate,
      totalMarks,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !courseId ||
      !dueDate ||
      !totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      dueDate,
      totalMarks,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};


// Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course", "courseCode courseName")
      .populate("createdBy", "name email role")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get assignments",
      error: error.message,
    });
  }
};


// Get Assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("course", "courseCode courseName")
      .populate("createdBy", "name email role");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get assignment",
      error: error.message,
    });
  }
};


module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
};