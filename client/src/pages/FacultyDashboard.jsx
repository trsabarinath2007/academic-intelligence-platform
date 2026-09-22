import React, { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function FacultyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin-analytics/overall-performance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch faculty analytics"
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

    fetchFacultyData();
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
          Loading faculty dashboard...
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

  const summary = data?.summary;

  const performance = data?.performance || [];

  const atRiskStudents =
    data?.atRiskStudents || [];

  const departmentAnalytics =
    data?.departmentAnalytics || [];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              Academic Intelligence
            </h1>

            <p className="text-xs text-gray-500">
              Faculty Portal
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Faculty Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Monitor student performance and academic analytics.
          </p>

        </div>


        {/* ================= SUMMARY ================= */}

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Students */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Students
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {summary?.totalStudents || 0}
            </p>

          </div>


          {/* GPA */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Average GPA
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {summary?.averageGPA || 0}
            </p>

          </div>


          {/* Attendance */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Average Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {summary?.averageAttendance || 0}%
            </p>

          </div>


          {/* Quiz */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Average Quiz Score
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {summary?.averageQuizScore || 0}%
            </p>

          </div>

        </div>


        {/* ================= SECONDARY SUMMARY ================= */}

        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              High Performers
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {summary?.highPerformers || 0}
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Need Improvement
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {summary?.studentsNeedingImprovement || 0}
            </p>

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              At-Risk Students
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {summary?.atRiskStudents || 0}
            </p>

          </div>

        </div>


        {/* ================= STUDENT PERFORMANCE ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Student Performance
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Overview of individual student academic performance.
          </p>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={performance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="studentId"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="gpa"
                  fill="#2563eb"
                  name="GPA"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* ================= DEPARTMENT ANALYTICS ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Department Analytics
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Average performance across departments.
          </p>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={departmentAnalytics}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="department"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="averageGPA"
                  fill="#9333ea"
                  name="Average GPA"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* ================= STUDENT TABLE ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Student Overview
          </h2>

          {performance.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Semester
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      GPA
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Quiz
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100">

                  {performance.map(
                    (student, index) => (

                      <tr
                        key={index}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="px-6 py-4 font-bold text-gray-800">
                          {student.studentId}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {student.department}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-700">
                          {student.semester}
                        </td>

                        <td className="px-6 py-4 text-center font-bold text-blue-600">
                          {student.gpa}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-700">
                          {student.attendancePercentage}%
                        </td>

                        <td className="px-6 py-4 text-center text-gray-700">
                          {student.quizAverage}%
                        </td>

                        <td className="px-6 py-4 text-center">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              student.status ===
                              "Excellent"
                                ? "bg-green-100 text-green-700"
                                : student.status ===
                                  "Good"
                                ? "bg-blue-100 text-blue-700"
                                : student.status ===
                                  "Average"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <p className="text-center text-gray-500">
              No student data available.
            </p>

          )}

        </section>


        {/* ================= AT-RISK STUDENTS ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-gray-800">
              At-Risk Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Students who may require additional academic support.
            </p>

          </div>


          {atRiskStudents.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="bg-red-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      GPA
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Quiz
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100">

                  {atRiskStudents.map(
                    (student, index) => (

                      <tr
                        key={index}
                        className="hover:bg-red-50"
                      >

                        <td className="px-6 py-4 font-bold text-gray-800">
                          {student.studentId}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {student.department}
                        </td>

                        <td className="px-6 py-4 text-center font-semibold text-red-600">
                          {student.gpa}
                        </td>

                        <td className="px-6 py-4 text-center text-gray-700">
                          {student.attendancePercentage}%
                        </td>

                        <td className="px-6 py-4 text-center text-gray-700">
                          {student.quizAverage}%
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="rounded-lg bg-green-50 p-5 text-center">

              <p className="font-semibold text-green-700">
                No at-risk students found.
              </p>

            </div>

          )}

        </section>


        {/* ================= QUICK ACTIONS ================= */}

        <section>

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Faculty Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* Students */}

            <button
              onClick={() => {
                window.location.href =
                  "/faculty-students";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Students
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View and manage student information.
              </p>

            </button>


            {/* Attendance */}

            <button
              onClick={() => {
                window.location.href =
                  "/faculty-attendance";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Attendance
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Manage student attendance.
              </p>

            </button>


            {/* Assignments */}

            <button
              onClick={() => {
                window.location.href =
                  "/faculty-assignments";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Assignments
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create and manage assignments.
              </p>

            </button>


            {/* Submissions & Grading */}

            <button
              onClick={() => {
                window.location.href =
                  "/faculty-submissions";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Submissions & Grading
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Review and grade student submissions.
              </p>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default FacultyDashboard;