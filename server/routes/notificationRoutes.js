const express = require("express");

const {
  getMyNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require(
  "../controllers/notificationController"
);

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize(
    "student",
    "faculty",
    "admin"
  ),
  getMyNotifications
);

router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createNotification
);

router.patch(
  "/read-all",
  protect,
  authorize(
    "student",
    "faculty",
    "admin"
  ),
  markAllNotificationsAsRead
);

router.patch(
  "/:id/read",
  protect,
  authorize(
    "student",
    "faculty",
    "admin"
  ),
  markNotificationAsRead
);

router.delete(
  "/:id",
  protect,
  authorize(
    "student",
    "faculty",
    "admin"
  ),
  deleteNotification
);

module.exports = router;