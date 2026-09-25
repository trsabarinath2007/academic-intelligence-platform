const MaterialProgress = require("../models/MaterialProgress");
const Student = require("../models/Student");
const LearningMaterial = require("../models/LearningMaterial");

// ==========================================
// MARK MATERIAL AS COMPLETED
// ==========================================

const markMaterialCompleted = async (req, res) => {
  try {
    const { materialId } = req.params;

    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const material =
      await LearningMaterial.findById(materialId);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found",
      });
    }

    if (!material.isPublished) {
      return res.status(403).json({
        success: false,
        message:
          "This learning material is not published",
      });
    }

    const progress =
      await MaterialProgress.findOneAndUpdate(
        {
          student: student._id,
          material: materialId,
        },
        {
          student: student._id,
          material: materialId,
          completed: true,
          completedAt: new Date(),
          lastAccessedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Learning material marked as completed",
      progress,
    });
  } catch (error) {
    console.error(
      "Mark material completed error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update material progress",
      error: error.message,
    });
  }
};

// ==========================================
// GET STUDENT MATERIAL PROGRESS
// ==========================================

const getStudentMaterialProgress = async (
  req,
  res
) => {
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

    const progress =
      await MaterialProgress.find({
        student: student._id,
      })
        .populate(
          "material",
          "title type topic course"
        )
        .populate({
          path: "material",
          populate: {
            path: "course",
            select: "courseCode courseName",
          },
        })
        .sort({
          updatedAt: -1,
        });

    const completedCount =
      progress.filter(
        (item) => item.completed
      ).length;

    res.status(200).json({
      success: true,
      totalTracked: progress.length,
      completedCount,
      progress,
    });
  } catch (error) {
    console.error(
      "Get material progress error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch material progress",
      error: error.message,
    });
  }
};

module.exports = {
  markMaterialCompleted,
  getStudentMaterialProgress,
};