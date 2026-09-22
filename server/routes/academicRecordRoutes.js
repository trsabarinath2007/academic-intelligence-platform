const express = require("express");

const {
  createAcademicRecord,
  getAllAcademicRecords,
  getStudentAcademicRecords,
} = require("../controllers/academicRecordController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Student - Get Own Academic Records
// ========================================

router.get(
  "/student",
  protect,
  getStudentAcademicRecords
);

// ========================================
// Admin - Get All Academic Records
// ========================================

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllAcademicRecords
);

// ========================================
// Admin - Create Academic Record
// ========================================

router.post(
  "/",
  protect,
  authorize("admin"),
  createAcademicRecord
);

module.exports = router;