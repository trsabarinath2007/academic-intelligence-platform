const express = require("express");

const {
  getStudentRisk,
  getStudentRiskById,
} = require("../controllers/riskController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// STUDENT - GET OWN RISK
// ==========================================
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentRisk
);

// ==========================================
// FACULTY / ADMIN - GET SPECIFIC STUDENT RISK
// ==========================================
router.get(
  "/student/:id",
  protect,
  authorize("faculty", "admin"),
  getStudentRiskById
);

module.exports = router;