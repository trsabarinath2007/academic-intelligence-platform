const express = require("express");

const {
  getMyAcademicIntelligence,
  getMyAIAnalysis,
} = require("../controllers/academicIntelligenceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/student",
  protect,
  authorize("student"),
  getMyAcademicIntelligence
);

router.get(
  "/student/ai-analysis",
  protect,
  authorize("student"),
  getMyAIAnalysis
);

module.exports = router;