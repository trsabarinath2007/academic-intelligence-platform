const LearningMaterial = require("../models/LearningMaterial");
const Course = require("../models/Course");


// Create learning material
const createLearningMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      type,
      fileUrl,
      externalUrl,
      topic,
      isPublished,
    } = req.body;

    if (!title || !course || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, course and type are required",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const material = await LearningMaterial.create({
      title,
      description,
      course,
      faculty: req.user._id,
      type,
      fileUrl,
      externalUrl,
      topic,
      isPublished:
        isPublished === undefined ? true : isPublished,
    });

    const populatedMaterial =
      await LearningMaterial.findById(material._id)
        .populate("course", "courseCode courseName")
        .populate("faculty", "name email");

    res.status(201).json({
      success: true,
      message: "Learning material created successfully",
      material: populatedMaterial,
    });
  } catch (error) {
    console.error("Create learning material error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create learning material",
      error: error.message,
    });
  }
};


// Get all published materials for students
const getPublishedMaterials = async (req, res) => {
  try {
    const materials = await LearningMaterial.find({
      isPublished: true,
    })
      .populate("course", "courseCode courseName")
      .populate("faculty", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error("Get published materials error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning materials",
      error: error.message,
    });
  }
};


// Get all materials created by logged-in faculty
const getFacultyMaterials = async (req, res) => {
  try {
    const materials = await LearningMaterial.find({
      faculty: req.user._id,
    })
      .populate("course", "courseCode courseName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error("Get faculty materials error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty materials",
      error: error.message,
    });
  }
};


// Get material by ID
const getLearningMaterialById = async (req, res) => {
  try {
    const material = await LearningMaterial.findById(req.params.id)
      .populate("course", "courseCode courseName")
      .populate("faculty", "name email");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found",
      });
    }

    res.status(200).json({
      success: true,
      material,
    });
  } catch (error) {
    console.error("Get learning material error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning material",
      error: error.message,
    });
  }
};


// Update learning material
const updateLearningMaterial = async (req, res) => {
  try {
    const material = await LearningMaterial.findById(
      req.params.id
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found",
      });
    }

    if (
      material.faculty.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own materials",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "course",
      "type",
      "fileUrl",
      "externalUrl",
      "topic",
      "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        material[field] = req.body[field];
      }
    });

    await material.save();

    const updatedMaterial =
      await LearningMaterial.findById(material._id)
        .populate("course", "courseCode courseName")
        .populate("faculty", "name email");

    res.status(200).json({
      success: true,
      message: "Learning material updated successfully",
      material: updatedMaterial,
    });
  } catch (error) {
    console.error("Update learning material error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update learning material",
      error: error.message,
    });
  }
};


// Delete learning material
const deleteLearningMaterial = async (req, res) => {
  try {
    const material = await LearningMaterial.findById(
      req.params.id
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found",
      });
    }

    if (
      material.faculty.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own materials",
      });
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message: "Learning material deleted successfully",
    });
  } catch (error) {
    console.error("Delete learning material error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete learning material",
      error: error.message,
    });
  }
};


module.exports = {
  createLearningMaterial,
  getPublishedMaterials,
  getFacultyMaterials,
  getLearningMaterialById,
  updateLearningMaterial,
  deleteLearningMaterial,
};