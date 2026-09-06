const express = require("express");

const {
  createAcademicRecord,
  getAllAcademicRecords,
} = require("../controllers/academicRecordController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all academic records - Admin only
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllAcademicRecords
);

// Create academic record - Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createAcademicRecord
);

module.exports = router;