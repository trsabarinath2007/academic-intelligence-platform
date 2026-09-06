const mongoose = require("mongoose");

const academicRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    internalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
    },

    externalMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    grade: {
      type: String,
      default: "",
    },

    semester: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AcademicRecord",
  academicRecordSchema
);