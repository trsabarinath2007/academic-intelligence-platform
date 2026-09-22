import React, { useEffect, useState } from "react";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/course-attendance/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch attendance"
          );
        }

        setAttendance(data.courseAttendance || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          Loading attendance...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h1 className="mb-3 text-xl font-bold text-red-600">
            Error
          </h1>

          <p className="mb-5 text-gray-600">
            {error}
          </p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalClasses = attendance.reduce(
    (sum, item) => sum + item.totalClasses,
    0
  );

  const presentClasses = attendance.reduce(
    (sum, item) => sum + item.presentClasses,
    0
  );

  const overallPercentage =
    totalClasses > 0
      ? ((presentClasses / totalClasses) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              Academic Intelligence
            </h1>

            <p className="text-xs text-gray-500">
              Student Portal
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                window.location.href =
                  "/student-dashboard";
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance
          </h1>

          <p className="mt-1 text-gray-500">
            View your course-wise attendance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalClasses}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Present Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {presentClasses}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Overall Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {overallPercentage}%
            </p>
          </div>

        </div>

        {/* Attendance Table */}
        {attendance.length > 0 ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Course
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Total Classes
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Present
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Absent
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {attendance.map((item) => (
                    <tr
                      key={item.courseCode}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <p className="font-bold text-gray-800">
                          {item.courseCode}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.courseName}
                        </p>

                      </td>

                      <td className="px-6 py-4 text-center font-medium text-gray-700">
                        {item.totalClasses}
                      </td>

                      <td className="px-6 py-4 text-center font-medium text-green-600">
                        {item.presentClasses}
                      </td>

                      <td className="px-6 py-4 text-center font-medium text-red-500">
                        {item.absentClasses}
                      </td>

                      <td className="px-6 py-4 text-center">

                        <span className="font-bold text-gray-800">
                          {item.attendancePercentage}%
                        </span>

                      </td>

                      <td className="px-6 py-4 text-center">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.status === "Excellent"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Good"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "Critical"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No attendance records found.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default Attendance;