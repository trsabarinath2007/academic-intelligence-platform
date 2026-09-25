const LearningMaterial = require("../models/LearningMaterial");
const Course = require("../models/Course");
const fs = require("fs");
const path = require("path");

// ==========================================
// CREATE LEARNING MATERIAL
// ==========================================

const createLearningMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      type,
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

    let uploadedFileUrl = "";

    if (req.file) {
      uploadedFileUrl =
        `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const material = await LearningMaterial.create({
      title,
      description,
      course,
      faculty: req.user._id,
      type,
      fileUrl: uploadedFileUrl,
      externalUrl: externalUrl || "",
      topic: topic || "",
      isPublished:
        isPublished === undefined
          ? true
          : isPublished === true ||
            isPublished === "true",
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
    console.error(
      "Create learning material error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create learning material",
      error: error.message,
    });
  }
};

// ==========================================
// GET PUBLISHED MATERIALS - STUDENT
// ==========================================

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
    console.error(
      "Get published materials error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning materials",
      error: error.message,
    });
  }
};

// ==========================================
// GET FACULTY MATERIALS
// ==========================================

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
    console.error(
      "Get faculty materials error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning materials",
      error: error.message,
    });
  }
};

// ==========================================
// GET MATERIAL BY ID
// ==========================================

const getLearningMaterialById = async (req, res) => {
  try {
    const material =
      await LearningMaterial.findById(req.params.id)
        .populate("course", "courseCode courseName")
        .populate("faculty", "name email");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found",
      });
    }

    // Students can only access published materials
    if (
      req.user.role === "student" &&
      material.isPublished !== true
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This learning material is not published",
      });
    }

    // Faculty can access only their own material
    if (
      req.user.role === "faculty" &&
      material.faculty._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only access your own materials",
      });
    }

    res.status(200).json({
      success: true,
      material,
    });
  } catch (error) {
    console.error(
      "Get learning material error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch learning material",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE LEARNING MATERIAL
// ==========================================

const updateLearningMaterial = async (req, res) => {
  try {
    const material =
      await LearningMaterial.findById(req.params.id);

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
        message:
          "You can only update your own materials",
      });
    }

    if (req.body.course !== undefined) {
      const existingCourse =
        await Course.findById(req.body.course);

      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    }

    // Delete old uploaded file when replacing it
    if (req.file && material.fileUrl) {
      try {
        const oldFileName = path.basename(
          new URL(material.fileUrl).pathname
        );

        const oldFilePath = path.join(
          __dirname,
          "../uploads",
          oldFileName
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (fileError) {
        console.log(
          "Old file cleanup skipped:",
          fileError.message
        );
      }
    }

    const allowedFields = [
      "title",
      "description",
      "course",
      "type",
      "externalUrl",
      "topic",
      "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "isPublished") {
          material[field] =
            req.body[field] === true ||
            req.body[field] === "true";
        } else {
          material[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      material.fileUrl =
        `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await material.save();

    const updatedMaterial =
      await LearningMaterial.findById(material._id)
        .populate("course", "courseCode courseName")
        .populate("faculty", "name email");

    res.status(200).json({
      success: true,
      message:
        "Learning material updated successfully",
      material: updatedMaterial,
    });
  } catch (error) {
    console.error(
      "Update learning material error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update learning material",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE LEARNING MATERIAL
// ==========================================

const deleteLearningMaterial = async (req, res) => {
  try {
    const material =
      await LearningMaterial.findById(req.params.id);

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
        message:
          "You can only delete your own materials",
      });
    }

    if (material.fileUrl) {
      try {
        const fileName = path.basename(
          new URL(material.fileUrl).pathname
        );

        const filePath = path.join(
          __dirname,
          "../uploads",
          fileName
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.log(
          "File cleanup skipped:",
          fileError.message
        );
      }
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Learning material deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete learning material error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete learning material",
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