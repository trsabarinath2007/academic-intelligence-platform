const mongoose = require("mongoose");

const materialProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningMaterial",
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

materialProgressSchema.index(
  {
    student: 1,
    material: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "MaterialProgress",
  materialProgressSchema
);