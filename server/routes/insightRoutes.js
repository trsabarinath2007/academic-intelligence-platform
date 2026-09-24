const express = require("express");

const {
  getStudentInsights,
  getStudentInsightsById,
} = require("../controllers/insightController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// STUDENT - GET OWN PERFORMANCE INSIGHTS
// ==========================================

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentInsights
);

// ==========================================
// FACULTY / ADMIN - GET SPECIFIC STUDENT INSIGHTS
// ==========================================

router.get(
  "/student/:id",
  protect,
  authorize("faculty", "admin"),
  getStudentInsightsById
);

module.exports = router;