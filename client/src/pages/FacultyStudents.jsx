import { useEffect, useState } from "react";
import axios from "axios";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(response.data.students || []);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const departments = [
    "All",
    ...new Set(
      students.map((student) => student.department)
    ),
  ];

  const filteredStudents = students.filter((student) => {
    const name = student.user?.name || "";
    const email = student.user?.email || "";

    const matchesSearch =
      student.studentId
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" ||
      student.department === department;

    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Students
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage student information
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search by name, email or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="border rounded-lg px-4 py-3 outline-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Student count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold">
              {filteredStudents.length}
            </span>{" "}
            student(s)
          </p>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">
                    Student ID
                  </th>

                  <th className="text-left px-6 py-4">
                    Name
                  </th>

                  <th className="text-left px-6 py-4">
                    Email
                  </th>

                  <th className="text-left px-6 py-4">
                    Department
                  </th>

                  <th className="text-left px-6 py-4">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4">
                    Section
                  </th>

                  <th className="text-left px-6 py-4">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {student.studentId}
                      </td>

                      <td className="px-6 py-4">
                        {student.user?.name || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {student.user?.email || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {student.department}
                      </td>

                      <td className="px-6 py-4">
                        {student.semester}
                      </td>

                      <td className="px-6 py-4">
                        {student.section || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          Student
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500"
                    >
                      No students found.
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

export default FacultyStudents;