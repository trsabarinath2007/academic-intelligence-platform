const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["document", "video", "link", "other"],
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
      trim: true,
    },

    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    topic: {
      type: String,
      trim: true,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

learningMaterialSchema.index({
  course: 1,
  createdAt: -1,
});

learningMaterialSchema.index({
  faculty: 1,
});

module.exports = mongoose.model(
  "LearningMaterial",
  learningMaterialSchema
);