const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ==========================================
// CREATE ASSIGNMENT
// ==========================================

router.post(
  "/",
  protect,
  authorize("faculty"),
  createAssignment
);

// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================

router.get(
  "/",
  protect,
  getAllAssignments
);

// ==========================================
// GET ASSIGNMENT BY ID
// ==========================================

router.get(
  "/:id",
  protect,
  getAssignmentById
);

// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

router.put(
  "/:id",
  protect,
  authorize("faculty"),
  updateAssignment
);

// ==========================================
// DELETE ASSIGNMENT
// ==========================================

router.delete(
  "/:id",
  protect,
  authorize("faculty"),
  deleteAssignment
);

module.exports = router;