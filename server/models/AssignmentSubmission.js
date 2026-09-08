const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    submissionText: {
      type: String,
      required: true,
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Submitted", "Graded", "Late"],
      default: "Submitted",
    },

    marksObtained: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a student from submitting the same assignment multiple times
assignmentSubmissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);