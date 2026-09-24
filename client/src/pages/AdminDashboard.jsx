import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Layout from "../components/Layout";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin-analytics/overall-performance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout
        role="admin"
        title="Admin Dashboard"
        description="Overview of academic performance"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E6EAF0] border-t-[#315EFB]" />

            <p className="mt-4 text-sm text-[#667085]">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        role="admin"
        title="Admin Dashboard"
        description="Overview of academic performance"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAnalytics}
              className="mt-4 rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244bd1]"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const summary = data?.summary || {};
  const performance = data?.performance || [];
  const departmentAnalytics =
    data?.departmentAnalytics || [];
  const atRiskStudents = data?.atRiskStudents || [];

  return (
    <Layout
      role="admin"
      title="Admin Dashboard"
      description="Overview of academic performance"
    >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Monitor students and overall academic performance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Students */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Total Students
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#172033]">
                  {summary.totalStudents ?? 0}
                </p>

                <p className="mt-1 text-xs text-[#98A2B3]">
                  Registered students
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#315EFB]">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20c.6-3.2 2.7-5 6-5s5.4 1.8 6 5" />
                  <path d="M16 5.5a3 3 0 0 1 0 5.8" />
                  <path d="M18 15c1.8.7 2.8 2 3 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average GPA */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Average GPA
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#315EFB]">
                  {summary.averageGPA ?? 0}
                </p>

                <p className="mt-1 text-xs text-[#98A2B3]">
                  Across all students
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#315EFB]">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19V5" />
                  <path d="M4 19h17" />
                  <path d="m7 15 4-4 3 2 5-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Attendance */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Average Attendance
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#7C5CF6]">
                  {summary.averageAttendance ?? 0}%
                </p>

                <p className="mt-1 text-xs text-[#98A2B3]">
                  Overall attendance
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F1FF] text-[#7C5CF6]">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4" />
                  <path d="M16 3v4" />
                  <path d="M3 10h18" />
                  <path d="m8 15 2 2 5-5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quiz Score */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Average Quiz Score
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#172033]">
                  {summary.averageQuizScore ?? 0}%
                </p>

                <p className="mt-1 text-xs text-[#98A2B3]">
                  Across attempted quizzes
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#315EFB]">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <path d="M8 8h8" />
                  <path d="M8 12h5" />
                  <path d="M8 16h4" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              High Performers
            </p>

            <p className="mt-2 text-2xl font-semibold text-green-600">
              {summary.highPerformers ?? 0}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              GPA of 9 or above
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Need Improvement
            </p>

            <p className="mt-2 text-2xl font-semibold text-orange-500">
              {summary.studentsNeedingImprovement ?? 0}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Based on academic metrics
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              At-Risk Students
            </p>

            <p className="mt-2 text-2xl font-semibold text-red-500">
              {summary.atRiskStudents ?? 0}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Require attention
            </p>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Student GPA */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#172033]">
                Student GPA Overview
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                GPA comparison across students.
              </p>
            </div>

            {performance.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-[#98A2B3]">
                No performance data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={performance}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="studentId"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="gpa"
                    name="GPA"
                    radius={[6, 6, 0, 0]}
                    fill="#315EFB"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>

          {/* Department GPA */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#172033]">
                Department Performance
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Average GPA by department.
              </p>
            </div>

            {departmentAnalytics.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-[#98A2B3]">
                No department data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={departmentAnalytics}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="averageGPA"
                    name="Average GPA"
                    radius={[6, 6, 0, 0]}
                    fill="#7C5CF6"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>

        </div>

        {/* Department Analytics Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          <div className="border-b border-[#E6EAF0] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#172033]">
              Department Analytics
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Academic metrics by department.
            </p>
          </div>

          {departmentAnalytics.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#98A2B3]">
              No department analytics available.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="bg-[#F8FAFC]">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Students
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Average GPA
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Quiz Score
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F5]">

                  {departmentAnalytics.map(
                    (department) => (
                      <tr
                        key={department.department}
                        className="hover:bg-[#F8FAFC]"
                      >

                        <td className="px-6 py-4 text-sm font-medium text-[#172033]">
                          {department.department}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {department.students}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-[#315EFB]">
                          {department.averageGPA}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {department.averageAttendance}%
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {department.averageQuizScore}%
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* At Risk Students */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          <div className="border-b border-[#E6EAF0] px-6 py-5">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-[#172033]">
                  Students Requiring Attention
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Students meeting one or more improvement criteria.
                </p>
              </div>

              <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                {atRiskStudents.length} student
                {atRiskStudents.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

          </div>

          {atRiskStudents.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-[#172033]">
                No students currently require attention.
              </p>

              <p className="mt-1 text-sm text-[#667085]">
                No students meet the current risk criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

                <thead className="bg-[#F8FAFC]">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Student ID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Semester
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      GPA
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Quiz
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F5]">

                  {atRiskStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-[#F8FAFC]"
                    >

                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#315EFB]">
                          {student.studentId}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {student.department}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        Semester {student.semester}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-[#172033]">
                        {student.gpa}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {student.attendancePercentage}%
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {student.quizAverage}%
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </Layout>
  );
}

export default AdminDashboard;