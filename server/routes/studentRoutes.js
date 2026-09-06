const express = require("express");

const {
  createStudentProfile,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();


// Create Student Profile
router.post(
  "/profile",
  protect,
  authorize("student"),
  createStudentProfile
);

module.exports = router;