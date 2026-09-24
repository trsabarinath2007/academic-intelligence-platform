import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Layout from "../components/Layout";

function FacultyAnalytics() {
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
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load analytics."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {};

  const performanceData = useMemo(() => {
    return (data?.performance || []).map((student) => ({
      studentId: student.studentId,
      gpa: student.gpa,
      attendance: student.attendancePercentage,
      quiz: student.quizAverage,
    }));
  }, [data]);

  const departmentData = useMemo(() => {
    return (data?.departmentAnalytics || []).map((department) => ({
      department: department.department,
      gpa: department.averageGPA,
      attendance: department.averageAttendance,
      quiz: department.averageQuizScore,
    }));
  }, [data]);

  if (loading) {
    return (
      <Layout
        role="faculty"
        title="Analytics"
        description="Analyze overall student performance"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E6EAF0] border-t-[#315EFB]" />

            <p className="mt-4 text-sm text-[#667085]">
              Loading analytics...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        role="faculty"
        title="Analytics"
        description="Analyze overall student performance"
      >
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#172033]">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-5 rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244bd1]"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      role="faculty"
      title="Analytics"
      description="Analyze overall student performance"
    >
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Monitor academic performance, attendance and quiz
            results across students.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Students */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Total Students
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#172033]">
              {summary.totalStudents ?? 0}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Students in the system
            </p>
          </div>

          {/* Average GPA */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Average GPA
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#315EFB]">
              {Number(summary.averageGPA ?? 0).toFixed(2)}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Overall academic performance
            </p>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Average Attendance
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#2E9B68]">
              {summary.averageAttendance ?? 0}%
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Across all students
            </p>
          </div>

          {/* Quiz */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Average Quiz Score
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#7C5CF6]">
              {summary.averageQuizScore ?? 0}%
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Average quiz performance
            </p>
          </div>

        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Student GPA */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#172033]">
                Student GPA
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                GPA distribution across students
              </p>
            </div>

            <div className="h-[320px]">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#EEF1F5"
                    />

                    <XAxis
                      dataKey="studentId"
                      tick={{
                        fontSize: 12,
                        fill: "#667085",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 10]}
                      tick={{
                        fontSize: 12,
                        fill: "#667085",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E6EAF0",
                        boxShadow:
                          "0 8px 24px rgba(23, 32, 51, 0.08)",
                      }}
                    />

                    <Bar
                      dataKey="gpa"
                      name="GPA"
                      radius={[6, 6, 0, 0]}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#315EFB"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#98A2B3]">
                  No student performance data available.
                </div>
              )}
            </div>
          </div>

          {/* Department Performance */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#172033]">
                Department Performance
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Average GPA by department
              </p>
            </div>

            <div className="h-[320px]">
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    layout="vertical"
                    margin={{
                      left: 10,
                      right: 20,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#EEF1F5"
                    />

                    <XAxis
                      type="number"
                      domain={[0, 10]}
                      tick={{
                        fontSize: 12,
                        fill: "#667085",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="department"
                      width={110}
                      tick={{
                        fontSize: 11,
                        fill: "#667085",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E6EAF0",
                        boxShadow:
                          "0 8px 24px rgba(23, 32, 51, 0.08)",
                      }}
                    />

                    <Bar
                      dataKey="gpa"
                      name="Average GPA"
                      fill="#7C5CF6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#98A2B3]">
                  No department data available.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Attendance */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#172033]">
                Attendance Overview
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Student attendance percentages
              </p>
            </div>

            <div className="space-y-5">

              {performanceData.map((student) => (
                <div key={student.studentId}>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#172033]">
                      {student.studentId}
                    </span>

                    <span className="text-sm font-semibold text-[#667085]">
                      {student.attendance}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#EEF1F5]">
                    <div
                      className={`h-full rounded-full ${
                        student.attendance >= 75
                          ? "bg-[#2E9B68]"
                          : "bg-[#D94A4A]"
                      }`}
                      style={{
                        width: `${Math.min(
                          student.attendance,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Quiz Performance */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#172033]">
                Quiz Performance
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Average quiz scores by student
              </p>
            </div>

            <div className="space-y-5">

              {performanceData.map((student) => (
                <div key={student.studentId}>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#172033]">
                      {student.studentId}
                    </span>

                    <span className="text-sm font-semibold text-[#667085]">
                      {student.quiz}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#EEF1F5]">
                    <div
                      className="h-full rounded-full bg-[#7C5CF6]"
                      style={{
                        width: `${Math.min(
                          student.quiz,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

        {/* At Risk Students */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          <div className="border-b border-[#E6EAF0] px-6 py-5">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-[#172033]">
                  Students Requiring Attention
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Students currently identified by the analytics system
                </p>
              </div>

              <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">
                {summary.atRiskStudents ?? 0} At Risk
              </span>

            </div>
          </div>

          {data?.atRiskStudents?.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left">

                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Student
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

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F5]">

                  {data.atRiskStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="transition hover:bg-[#F8FAFC]"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#172033]">
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
                        {student.gpa.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            student.attendancePercentage < 75
                              ? "text-red-600"
                              : "text-[#2E9B68]"
                          }`}
                        >
                          {student.attendancePercentage}%
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {student.quizAverage}%
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-medium ${
                            student.status === "Good"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#667085]">
                No students currently require attention.
              </p>
            </div>
          )}

        </div>

        {/* Overall Status */}
        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#172033]">
            Performance Summary
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#667085]">
                High Performers
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#2E9B68]">
                {summary.highPerformers ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#667085]">
                Need Improvement
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#D99A22]">
                {summary.studentsNeedingImprovement ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#667085]">
                At-Risk Students
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#D94A4A]">
                {summary.atRiskStudents ?? 0}
              </p>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}

export default FacultyAnalytics;