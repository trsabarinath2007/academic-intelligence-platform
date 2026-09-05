const express = require("express");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Protected Profile Route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});


// Student Only Route
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Student",
    });
  }
);


// Faculty Only Route
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Faculty",
    });
  }
);


// Admin Only Route
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  }
);


module.exports = router;