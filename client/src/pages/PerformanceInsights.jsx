import React, { useEffect, useState } from "react";

function PerformanceInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/insights/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch performance insights"
          );
        }

        setData(result);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
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
          Loading performance insights...
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

  const student = data?.student;
  const insights = data?.insights;
  const summary = insights?.summary;

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
            Performance Insights
          </h1>

          <p className="mt-1 text-gray-500">
            Understand your academic strengths, weaknesses and recommendations.
          </p>

        </div>

        {/* Student Info */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Student ID
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.studentId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Semester
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.semester}
              </p>
            </div>

          </div>

        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Academic Records
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {summary?.academicRecords || 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {summary?.attendancePercentage || 0}%
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Quizzes Attempted
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {summary?.quizzesAttempted || 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Assignments Submitted
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {summary?.assignmentsSubmitted || 0}
            </p>
          </div>

        </div>

        {/* Strengths */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Strengths
              </h2>

              <p className="text-sm text-gray-500">
                Areas where you are performing well.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {insights?.strengths?.map((strength, index) => (
              <div
                key={index}
                className="rounded-lg bg-green-50 p-4 text-sm text-gray-700"
              >
                <span className="mr-2 font-bold text-green-600">
                  ✓
                </span>

                {strength}
              </div>
            ))}

          </div>

        </section>

        {/* Weaknesses */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Areas to Improve
              </h2>

              <p className="text-sm text-gray-500">
                Areas that need additional attention.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {insights?.weaknesses?.map((weakness, index) => (
              <div
                key={index}
                className="rounded-lg bg-red-50 p-4 text-sm text-gray-700"
              >
                <span className="mr-2 font-bold text-red-600">
                  !
                </span>

                {weakness}
              </div>
            ))}

          </div>

        </section>

        {/* Recommendations */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              💡
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recommendations
              </h2>

              <p className="text-sm text-gray-500">
                Suggestions based on your current performance.
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {insights?.recommendations?.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700"
                >
                  <span className="mr-2 font-bold text-blue-600">
                    →
                  </span>

                  {recommendation}
                </div>
              )
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default PerformanceInsights;