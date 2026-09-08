const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
} = require("../controllers/assignmentController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Create Assignment
router.post(
  "/",
  protect,
  createAssignment
);

// Get All Assignments
router.get(
  "/",
  protect,
  getAllAssignments
);

// Get Assignment by ID
router.get(
  "/:id",
  protect,
  getAssignmentById
);

module.exports = router;