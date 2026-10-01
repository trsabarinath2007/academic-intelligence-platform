const express = require("express");

const {
  getMyAcademicIntelligence,
  getMyAIAnalysis,
  studyAssistantChat,
  getFacultyAIInsights,
} = require("../controllers/academicIntelligenceController");

const discussionRoutes = require("./discussionRoutes");

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

router.post(
  "/student/study-assistant",
  protect,
  authorize("student"),
  studyAssistantChat
);

router.post(
  "/faculty/ai-insights",
  protect,
  authorize("faculty", "admin"),
  getFacultyAIInsights
);

router.use(
  "/discussion",
  discussionRoutes
);

module.exports = router;