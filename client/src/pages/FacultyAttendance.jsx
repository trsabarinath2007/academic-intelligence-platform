import { useEffect, useState } from "react";
import axios from "axios";

function FacultyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAttendance(response.data.attendance || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredAttendance = attendance.filter((record) => {
    const studentId =
      record.student?.studentId || "";

    const studentName =
      record.student?.user?.name || "";

    const courseCode =
      record.course?.courseCode || "";

    return (
      studentId
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      studentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      courseCode
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const getStatusStyle = (status) => {
    if (status === "Present") {
      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Faculty Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            View student attendance records
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <input
            type="text"
            placeholder="Search by student ID, name or course..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold">
              {filteredAttendance.length}
            </span>{" "}
            attendance record(s)
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">
                    Student ID
                  </th>

                  <th className="text-left px-6 py-4">
                    Student Name
                  </th>

                  <th className="text-left px-6 py-4">
                    Course
                  </th>

                  <th className="text-left px-6 py-4">
                    Date
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map(
                    (record) => (
                      <tr
                        key={record._id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-6 py-4 font-semibold">
                          {record.student?.studentId ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          {record.student?.user?.name ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          {record.course?.courseCode ||
                            "-"}{" "}
                          -{" "}
                          {record.course?.courseName ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          {record.date
                            ? new Date(
                                record.date
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        </div>

        {/* Back */}
        <div className="mt-6">
          <button
            onClick={() =>
              (window.location.href =
                "/faculty-dashboard")
            }
            className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Faculty Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default FacultyAttendance;