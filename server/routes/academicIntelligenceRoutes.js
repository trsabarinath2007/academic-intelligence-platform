const express = require("express");

const {
  getMyAcademicIntelligence,
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

module.exports = router;