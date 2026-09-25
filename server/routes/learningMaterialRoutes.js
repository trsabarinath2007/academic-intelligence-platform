const express = require("express");

const {
  createLearningMaterial,
  getPublishedMaterials,
  getFacultyMaterials,
  getLearningMaterialById,
  updateLearningMaterial,
  deleteLearningMaterial,
} = require("../controllers/learningMaterialController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Student: Get published learning materials
router.get(
  "/published",
  protect,
  authorize("student"),
  getPublishedMaterials
);

// Faculty: Get own learning materials
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  getFacultyMaterials
);

// Faculty: Create learning material with optional file
router.post(
  "/",
  protect,
  authorize("faculty"),
  upload.single("file"),
  createLearningMaterial
);

// Get material by ID
router.get(
  "/:id",
  protect,
  getLearningMaterialById
);

// Faculty: Update material
router.put(
  "/:id",
  protect,
  authorize("faculty"),
  upload.single("file"),
  updateLearningMaterial
);

// Faculty: Delete material
router.delete(
  "/:id",
  protect,
  authorize("faculty"),
  deleteLearningMaterial
);

module.exports = router;