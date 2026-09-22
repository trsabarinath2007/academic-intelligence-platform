import { useEffect, useState } from "react";
import axios from "axios";

function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch assignments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(
    (assignment) => {
      const title = assignment.title || "";
      const courseCode =
        assignment.course?.courseCode || "";
      const courseName =
        assignment.course?.courseName || "";

      const text =
        `${title} ${courseCode} ${courseName}`.toLowerCase();

      return text.includes(search.toLowerCase());
    }
  );

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Loading assignments...
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
            Faculty Assignments
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage assignments
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
            placeholder="Search by assignment or course..."
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
              {filteredAssignments.length}
            </span>{" "}
            assignment(s)
          </p>
        </div>

        {/* Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800">
                    {assignment.title}
                  </h2>

                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      isOverdue(assignment.dueDate)
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isOverdue(assignment.dueDate)
                      ? "Overdue"
                      : "Active"}
                  </span>

                </div>

                {/* Course */}
                <div className="mt-4">
                  <p className="font-semibold text-blue-600">
                    {assignment.course?.courseCode}
                  </p>

                  <p className="text-gray-600">
                    {assignment.course?.courseName}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 mt-4">
                  {assignment.description}
                </p>

                {/* Details */}
                <div className="border-t mt-5 pt-4 space-y-2">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Total Marks
                    </span>

                    <span className="font-semibold">
                      {assignment.totalMarks}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Due Date
                    </span>

                    <span className="font-semibold">
                      {assignment.dueDate
                        ? new Date(
                            assignment.dueDate
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Created By
                    </span>

                    <span className="font-semibold">
                      {assignment.createdBy?.name ||
                        "-"}
                    </span>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-10 text-center col-span-full">
              <p className="text-gray-500">
                No assignments found.
              </p>
            </div>
          )}

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

export default FacultyAssignments;