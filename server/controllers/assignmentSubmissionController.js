const AssignmentSubmission = require("../models/AssignmentSubmission");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

// Submit Assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionText } = req.body;

    if (!assignmentId || !submissionText) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID and submission text are required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

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

    let status = "Submitted";

    if (new Date() > assignment.dueDate) {
      status = "Late";
    }

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


// Grade Assignment Submission
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    if (marksObtained === undefined || marksObtained === null) {
      return res.status(400).json({
        success: false,
        message: "Marks obtained are required",
      });
    }

    const submission = await AssignmentSubmission.findById(submissionId)
      .populate("assignment", "totalMarks");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (
      marksObtained < 0 ||
      marksObtained > submission.assignment.totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${submission.assignment.totalMarks}`,
      });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback || "";
    submission.status = "Graded";

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Assignment graded successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to grade assignment",
      error: error.message,
    });
  }
};


module.exports = {
  submitAssignment,
  getMySubmissions,
  gradeSubmission,
};