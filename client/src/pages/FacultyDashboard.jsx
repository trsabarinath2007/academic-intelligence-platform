import React, { useEffect, useState } from "react";
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

const API = "http://localhost:5000/api";

function FacultyDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH FACULTY ANALYTICS
  // =====================================================

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        console.log("FETCHING FACULTY DASHBOARD");

        const response = await fetch(
          `${API}/admin-analytics/overall-performance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        console.log("FACULTY ANALYTICS:", result);

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch faculty analytics"
          );
        }

        setData(result);

        console.log("FACULTY DASHBOARD DATA LOADED");
      } catch (error) {
        console.error("FACULTY DASHBOARD ERROR:", error);
        setError(error.message);
      }
    };

    fetchFacultyData();
  }, []);

  // =====================================================
  // DATA
  // =====================================================

  const summary = data?.summary || {};

  const performance =
    data?.performance || [];

  const atRiskStudents =
    data?.atRiskStudents || [];

  const departmentAnalytics =
    data?.departmentAnalytics || [];

  // =====================================================
  // CHART DATA
  // =====================================================

  const studentPerformanceChart =
    performance.map((student) => ({
      studentId: student.studentId,
      gpa: Number(student.gpa) || 0,
    }));

  const departmentChart =
    departmentAnalytics.map((department) => ({
      department:
        department.department || "Unknown",
      averageGPA:
        Number(department.averageGPA) || 0,
    }));

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Layout
        role="faculty"
        title="Faculty Dashboard"
        description="Faculty academic analytics"
      >
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard unavailable
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >
              Go to Login
            </button>

          </div>
        </div>
      </Layout>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <Layout
      role="faculty"
      title="Faculty Dashboard"
      description="Monitor student performance and academic analytics"
    >
      <div className="space-y-7">

        {/* =================================================
            WELCOME BANNER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl">

          <div className="relative z-10">

            <p className="text-sm font-medium text-blue-100">
              Academic Intelligence Platform
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome, Faculty 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Monitor student academic performance,
              attendance, quizzes, assignments and
              identify students who may need additional
              support.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <InfoBadge
                label="Students"
                value={
                  summary.totalStudents || 0
                }
              />

              <InfoBadge
                label="At Risk"
                value={
                  summary.atRiskStudents || 0
                }
              />

              <InfoBadge
                label="Average GPA"
                value={
                  summary.averageGPA || 0
                }
              />

            </div>

          </div>

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-28 right-40 h-72 w-72 rounded-full bg-white/5" />

        </section>


        {/* =================================================
            MAIN SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Students"
            value={
              summary.totalStudents || 0
            }
            subtitle="Students monitored"
            icon="👥"
            iconStyle="blue"
          />

          <StatCard
            title="Average GPA"
            value={
              summary.averageGPA || 0
            }
            subtitle="Overall academic performance"
            icon="🎓"
            iconStyle="violet"
          />

          <StatCard
            title="Average Attendance"
            value={`${summary.averageAttendance || 0}%`}
            subtitle="Across all students"
            icon="📅"
            iconStyle="indigo"
          />

          <StatCard
            title="Average Quiz Score"
            value={`${summary.averageQuizScore || 0}%`}
            subtitle="Overall quiz performance"
            icon="📝"
            iconStyle="purple"
          />

        </div>


        {/* =================================================
            SECONDARY SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <SummaryCard
            title="High Performers"
            value={
              summary.highPerformers || 0
            }
            description="Students performing strongly"
            icon="🌟"
            type="success"
          />

          <SummaryCard
            title="Need Improvement"
            value={
              summary.studentsNeedingImprovement || 0
            }
            description="Students requiring attention"
            icon="📈"
            type="warning"
          />

          <SummaryCard
            title="At-Risk Students"
            value={
              summary.atRiskStudents || 0
            }
            description="Students needing support"
            icon="⚠️"
            type="danger"
          />

        </div>


        {/* =================================================
            CHARTS
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* STUDENT PERFORMANCE */}

          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

            <div className="mb-5">

              <p className="text-sm font-medium text-indigo-600">
                Academic Analytics
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Student GPA Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                GPA comparison across students
              </p>

            </div>

            <div className="h-[330px]">

              {studentPerformanceChart.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={studentPerformanceChart}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="studentId"
                    />

                    <YAxis
                      domain={[0, 10]}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="gpa"
                      fill="#4f46e5"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (

                <EmptyState
                  text="No student performance data available."
                />

              )}

            </div>

          </section>


          {/* DEPARTMENT PERFORMANCE */}

          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

            <div className="mb-5">

              <p className="text-sm font-medium text-violet-600">
                Department Analytics
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Department-wise GPA
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Average GPA across departments
              </p>

            </div>

            <div className="h-[330px]">

              {departmentChart.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={departmentChart}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="department"
                    />

                    <YAxis
                      domain={[0, 10]}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="averageGPA"
                      fill="#7c3aed"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (

                <EmptyState
                  text="No department data available."
                />

              )}

            </div>

          </section>

        </div>


        {/* =================================================
            STUDENT OVERVIEW
        ================================================= */}

        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

          <div className="mb-5">

            <p className="text-sm font-medium text-blue-600">
              Student Analytics
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Student Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Individual student academic performance
            </p>

          </div>


          {performance.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>

                  <tr className="border-b border-slate-100">

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Semester
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      GPA
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Attendance
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quiz
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {performance.map(
                    (student, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-50 transition hover:bg-violet-50/40"
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">

                              {student.studentId
                                ?.slice(0, 1)
                                ?.toUpperCase()}

                            </div>

                            <span className="font-semibold text-slate-700">
                              {student.studentId}
                            </span>

                          </div>

                        </td>


                        <td className="px-4 py-4 text-sm text-slate-600">
                          {student.department}
                        </td>


                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                          {student.semester}
                        </td>


                        <td className="px-4 py-4 text-center">

                          <span className="font-bold text-indigo-600">
                            {student.gpa}
                          </span>

                        </td>


                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                          {student.attendancePercentage}%
                        </td>


                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                          {student.quizAverage}%
                        </td>


                        <td className="px-4 py-4 text-center">

                          <StatusBadge
                            status={student.status}
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyState
              text="No student data available."
            />

          )}

        </section>


        {/* =================================================
            AT-RISK STUDENTS
        ================================================= */}

        <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                ⚠️
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  At-Risk Students
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Students who may require additional academic support
                </p>

              </div>

            </div>

          </div>


          {atRiskStudents.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>

                  <tr className="border-b border-red-100 bg-red-50/50">

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      GPA
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Attendance
                    </th>

                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quiz
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {atRiskStudents.map(
                    (student, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-50 hover:bg-red-50/40"
                      >

                        <td className="px-4 py-4">

                          <span className="font-semibold text-slate-700">
                            {student.studentId}
                          </span>

                        </td>


                        <td className="px-4 py-4 text-sm text-slate-600">
                          {student.department}
                        </td>


                        <td className="px-4 py-4 text-center font-bold text-red-600">
                          {student.gpa}
                        </td>


                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                          {student.attendancePercentage}%
                        </td>


                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                          {student.quizAverage}%
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="rounded-2xl bg-green-50 p-6 text-center">

              <div className="text-3xl">
                🎉
              </div>

              <p className="mt-2 font-semibold text-green-700">
                No at-risk students found.
              </p>

              <p className="mt-1 text-sm text-green-600">
                All students are currently within the monitored range.
              </p>

            </div>

          )}

        </section>


        {/* =================================================
            FACULTY ACTIONS
        ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-sm font-medium text-indigo-600">
              Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Faculty Actions
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <ActionCard
              icon="👥"
              title="Students"
              description="View and manage student information."
              path="/faculty-students"
            />

            <ActionCard
              icon="📅"
              title="Attendance"
              description="Manage and monitor student attendance."
              path="/faculty-attendance"
            />

            <ActionCard
              icon="📚"
              title="Assignments"
              description="Create and manage assignments."
              path="/faculty-assignments"
            />

            <ActionCard
              icon="📝"
              title="Submissions & Grading"
              description="Review and grade student submissions."
              path="/faculty-submissions"
            />

          </div>

        </section>

      </div>
    </Layout>
  );
}


// =====================================================
// INFO BADGE
// =====================================================

function InfoBadge({ label, value }) {
  return (
    <div className="rounded-xl bg-white/15 px-4 py-2 backdrop-blur">

      <p className="text-xs text-blue-100">
        {label}
      </p>

      <p className="text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconStyle,
}) {
  const styles = {
    blue: "from-blue-500 to-blue-600",
    violet: "from-violet-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-violet-600",
  };

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>


        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${
            styles[iconStyle]
          } text-xl text-white shadow-lg`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  description,
  icon,
  type,
}) {
  const styles = {
    success: {
      bg: "bg-green-50",
      text: "text-green-600",
    },

    warning: {
      bg: "bg-amber-50",
      text: "text-amber-600",
    },

    danger: {
      bg: "bg-red-50",
      text: "text-red-600",
    },
  };

  const style = styles[type];

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>


        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.bg} text-xl`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  let className =
    "bg-slate-100 text-slate-600";

  if (status === "Excellent") {
    className =
      "bg-green-100 text-green-700";
  } else if (status === "Good") {
    className =
      "bg-blue-100 text-blue-700";
  } else if (status === "Average") {
    className =
      "bg-amber-100 text-amber-700";
  } else {
    className =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status || "Unknown"}
    </span>
  );
}


// =====================================================
// ACTION CARD
// =====================================================

function ActionCard({
  icon,
  title,
  description,
  path,
}) {
  return (
    <button
      onClick={() => {
        window.location.href = path;
      }}
      className="group rounded-3xl border border-violet-100 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
    >

      <div className="flex items-start justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl text-white shadow-lg">
          {icon}
        </div>

        <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500">
          →
        </span>

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </button>
  );
}


// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ text }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center">

      <div className="text-center">

        <div className="mb-3 text-3xl">
          📊
        </div>

        <p className="text-sm text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default FacultyDashboard;