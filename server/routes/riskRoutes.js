const express = require("express");

const {
  getStudentRisk,
} = require("../controllers/riskController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Student Risk Prediction
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentRisk
);

module.exports = router;