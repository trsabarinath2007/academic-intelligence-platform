const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// ==========================================
// CREATE ASSIGNMENT
// ==========================================

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      dueDate,
      totalMarks,
    } = req.body;

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

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      dueDate,
      totalMarks,
      createdBy: req.user._id,
    });

    const populatedAssignment =
      await Assignment.findById(assignment._id)
        .populate(
          "course",
          "courseCode courseName"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment: populatedAssignment,
    });
  } catch (error) {
    console.error(
      "Create assignment error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate(
        "course",
        "courseCode courseName"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error(
      "Get assignments error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get assignments",
      error: error.message,
    });
  }
};

// ==========================================
// GET ASSIGNMENT BY ID
// ==========================================

const getAssignmentById = async (req, res) => {
  try {
    const assignment =
      await Assignment.findById(req.params.id)
        .populate(
          "course",
          "courseCode courseName"
        )
        .populate(
          "createdBy",
          "name email role"
        );

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
    console.error(
      "Get assignment error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get assignment",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

const updateAssignment = async (req, res) => {
  try {
    const assignment =
      await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only the faculty who created the assignment
    // can update it.
    if (
      assignment.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update your own assignments",
      });
    }

    const {
      title,
      description,
      courseId,
      dueDate,
      totalMarks,
    } = req.body;

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

    const course =
      await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    assignment.title = title;
    assignment.description = description;
    assignment.course = courseId;
    assignment.dueDate = dueDate;
    assignment.totalMarks = totalMarks;

    await assignment.save();

    const updatedAssignment =
      await Assignment.findById(assignment._id)
        .populate(
          "course",
          "courseCode courseName"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    res.status(200).json({
      success: true,
      message:
        "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(
      "Update assignment error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update assignment",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE ASSIGNMENT
// ==========================================

const deleteAssignment = async (req, res) => {
  try {
    const assignment =
      await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only the faculty who created the assignment
    // can delete it.
    if (
      assignment.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own assignments",
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Assignment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete assignment error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete assignment",
      error: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};