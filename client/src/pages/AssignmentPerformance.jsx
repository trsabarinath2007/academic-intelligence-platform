import React, { useEffect, useState } from "react";

function AssignmentPerformance() {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignmentPerformance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/assignment-performance/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch assignment performance"
          );
        }

        setAssignments(
          data.assignmentPerformance || []
        );

        setSummary(data.summary || null);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentPerformance();
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
          Loading assignment performance...
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

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Assignment Performance
          </h1>

          <p className="mt-1 text-gray-500">
            View your assignment scores and feedback.
          </p>

        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Assignments
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {summary?.totalAssignments || 0}
            </p>

          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Graded Assignments
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {summary?.gradedAssignments || 0}
            </p>

          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Average Percentage
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {summary?.averagePercentage || 0}%
            </p>

          </div>

        </div>

        {/* Assignment Cards */}
        {assignments.length > 0 ? (

          <div className="grid gap-6 md:grid-cols-2">

            {assignments.map((assignment, index) => {

              const percentage =
                assignment.totalMarks > 0 &&
                assignment.marksObtained !== null
                  ? (
                      (assignment.marksObtained /
                        assignment.totalMarks) *
                      100
                    ).toFixed(0)
                  : 0;

              return (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Title */}
                  <div className="mb-4 flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {assignment.assignmentTitle}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {assignment.courseCode} -{" "}
                        {assignment.courseName}
                      </p>
                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                      {assignment.performanceLevel}
                    </span>

                  </div>

                  {/* Marks */}
                  <div className="mb-5 grid grid-cols-2 gap-4">

                    <div className="rounded-lg bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Marks
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {assignment.marksObtained}/
                        {assignment.totalMarks}
                      </p>

                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">

                      <p className="text-sm text-gray-500">
                        Percentage
                      </p>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {percentage}%
                      </p>

                    </div>

                  </div>

                  {/* Status */}
                  <div className="mb-4">

                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {assignment.status}
                    </span>

                  </div>

                  {/* Feedback */}
                  {assignment.feedback && (
                    <div className="rounded-lg bg-blue-50 p-4">

                      <p className="text-sm font-semibold text-blue-700">
                        Faculty Feedback
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {assignment.feedback}
                      </p>

                    </div>
                  )}

                  {/* Due Date */}
                  {assignment.dueDate && (
                    <p className="mt-4 text-xs text-gray-500">
                      Due Date:{" "}
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                </div>
              );
            })}

          </div>

        ) : (

          <div className="rounded-xl bg-white p-8 text-center shadow-sm">

            <p className="text-gray-500">
              No assignment records found.
            </p>

          </div>

        )}

      </main>
    </div>
  );
}

export default AssignmentPerformance;