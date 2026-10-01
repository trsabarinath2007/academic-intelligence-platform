const Notification = require("../models/Notification");

const getMyNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(100);

    const unreadCount =
      await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications",
      error: error.message,
    });
  }
};

const createNotification = async (
  req,
  res
) => {
  try {
    const {
      recipient,
      type,
      title,
      message,
      relatedId,
    } = req.body;

    if (
      !recipient ||
      !title ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Recipient, title and message are required",
      });
    }

    const notification =
      await Notification.create({
        recipient,
        type: type || "general",
        title: title.trim(),
        message: message.trim(),
        relatedId: relatedId || null,
      });

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create notification",
      error: error.message,
    });
  }
};

const markNotificationAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          recipient: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      notification.isRead = true;

      await notification.save();

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notification",
        error: error.message,
      });
    }
  };

const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      const result =
        await Notification.updateMany(
          {
            recipient: req.user._id,
            isRead: false,
          },
          {
            $set: {
              isRead: true,
            },
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
        modifiedCount:
          result.modifiedCount,
      });
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notifications",
        error: error.message,
      });
    }
  };

const deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          recipient: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      await notification.deleteOne();

      return res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete notification",
        error: error.message,
      });
    }
  };

module.exports = {
  getMyNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};