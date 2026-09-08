const AssignmentSubmission = require("../models/AssignmentSubmission");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

// Submit Assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionText } = req.body;

    // Validate fields
    if (!assignmentId || !submissionText) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID and submission text are required",
      });
    }

    // Check assignment
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Get student profile of logged-in user
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check duplicate submission
    const existingSubmission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: student._id,
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: "Assignment already submitted",
      });
    }

    // Check if submission is late
    let status = "Submitted";

    if (new Date() > assignment.dueDate) {
      status = "Late";
    }

    // Create submission
    const submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      student: student._id,
      submissionText,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit assignment",
      error: error.message,
    });
  }
};


// Get My Submissions
const getMySubmissions = async (req, res) => {
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

    const submissions = await AssignmentSubmission.find({
      student: student._id,
    })
      .populate("assignment", "title description dueDate totalMarks")
      .populate({
        path: "assignment",
        populate: {
          path: "course",
          select: "courseCode courseName",
        },
      })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
      error: error.message,
    });
  }
};

module.exports = {
  submitAssignment,
  getMySubmissions,
};