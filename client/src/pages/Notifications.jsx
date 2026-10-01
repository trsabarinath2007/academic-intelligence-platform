import React, {
  useEffect,
  useState,
} from "react";

const API_URL =
  "http://localhost:5000/api/academic-intelligence/notifications";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(API_URL, {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch notifications"
          );
        }

        setNotifications(
          data.notifications || []
        );

        setUnreadCount(
          data.unreadCount || 0
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  const markAsRead =
    async (notificationId) => {
      try {
        const response =
          await fetch(
            `${API_URL}/${notificationId}/read`,
            {
              method: "PATCH",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to mark notification as read"
          );
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification._id ===
                notificationId
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification
            )
        );

        setUnreadCount(
          (previous) =>
            Math.max(
              previous - 1,
              0
            )
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

  const markAllAsRead =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/read-all`,
            {
              method: "PATCH",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to mark notifications as read"
          );
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
              })
            )
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

  const deleteNotification =
    async (notificationId) => {
      try {
        const notification =
          notifications.find(
            (item) =>
              item._id ===
              notificationId
          );

        const response =
          await fetch(
            `${API_URL}/${notificationId}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete notification"
          );
        }

        setNotifications(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                notificationId
            )
        );

        if (
          notification &&
          !notification.isRead
        ) {
          setUnreadCount(
            (previous) =>
              Math.max(
                previous - 1,
                0
              )
          );
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

  const getTypeStyle = (type) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-700";

      case "quiz":
        return "bg-purple-100 text-purple-700";

      case "material":
        return "bg-green-100 text-green-700";

      case "attendance":
        return "bg-red-100 text-red-700";

      case "announcement":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="rounded-2xl bg-white p-8 text-center">
          Please log in first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Updates
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-800">
              Notifications
            </h1>

            <p className="mt-2 text-gray-500">
              Stay updated with assignments,
              quizzes, materials and academic
              announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {unreadCount} unread
            </span>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Notifications */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">
              🔔
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No notifications
            </h2>

            <p className="mt-2 text-gray-500">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  className={`
                    rounded-2xl
                    border
                    p-5
                    shadow-sm
                    transition
                    ${
                      notification.isRead
                        ? "border-gray-200 bg-white"
                        : "border-blue-200 bg-blue-50/50"
                    }
                  `}
                >
                  <div className="flex gap-4">
                    <div
                      className={`
                        flex h-11 w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-xl
                        ${getTypeStyle(
                          notification.type
                        )}
                      `}
                    >
                      {notification.type ===
                      "assignment"
                        ? "📝"
                        : notification.type ===
                          "quiz"
                        ? "🧠"
                        : notification.type ===
                          "material"
                        ? "📚"
                        : notification.type ===
                          "attendance"
                        ? "📅"
                        : notification.type ===
                          "announcement"
                        ? "📢"
                        : "🔔"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-gray-800">
                              {notification.title}
                            </h2>

                            {!notification.isRead && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                New
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                            {notification.type}
                          </p>
                        </div>

                        <p className="text-xs text-gray-400">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-3 leading-7 text-gray-600">
                        {notification.message}
                      </p>

                      <div className="mt-4 flex gap-3">
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Mark as Read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={fetchNotifications}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;