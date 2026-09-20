import React from "react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, Test Student 👋
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* GPA */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Current GPA
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            8.44
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Good Performance
          </p>
        </div>

        {/* Attendance */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            60%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Below 75%
          </p>
        </div>

        {/* Quiz */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Quiz Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            80%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Good
          </p>
        </div>

        {/* Assignment */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Assignment Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            90%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Excellent
          </p>
        </div>

      </div>

      {/* Risk Assessment */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow">

        <h2 className="text-xl font-semibold text-gray-800">
          Risk Assessment
        </h2>

        <div className="mt-4 flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Current Risk Level
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              Low Risk
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Risk Score
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              20 / 100
            </p>
          </div>

        </div>

        <div className="mt-5 rounded-lg bg-yellow-50 p-4">
          <p className="font-medium text-yellow-800">
            ⚠ Attendance is below 75%
          </p>

          <p className="mt-1 text-sm text-yellow-700">
            Improve your attendance to reduce academic risk.
          </p>
        </div>

      </div>

      {/* Academic Overview */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            Academic Overview
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Total Subjects
              </span>

              <span className="font-semibold">
                5
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Quizzes Attempted
              </span>

              <span className="font-semibold">
                1
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Assignments Graded
              </span>

              <span className="font-semibold">
                1
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Classes Attended
              </span>

              <span className="font-semibold">
                3 / 5
              </span>
            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            Quick Actions
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <button className="rounded-lg bg-blue-600 p-4 font-medium text-white hover:bg-blue-700">
              View Courses
            </button>

            <button className="rounded-lg bg-purple-600 p-4 font-medium text-white hover:bg-purple-700">
              View Assignments
            </button>

            <button className="rounded-lg bg-green-600 p-4 font-medium text-white hover:bg-green-700">
              View Quizzes
            </button>

            <button className="rounded-lg bg-gray-800 p-4 font-medium text-white hover:bg-gray-900">
              View Insights
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;