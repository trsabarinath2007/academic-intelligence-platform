import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  BarChart3,
  CalendarDays,
  ArrowUpRight,
  UserRound,
  Building2,
  Award,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import Layout from "../components/Layout";

const API_URL =
  "http://localhost:5000/api/admin-analytics/overall-performance";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load dashboard data."
        );
      }

      setData(result);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {};
  const performance = data?.performance || [];
  const departmentAnalytics = data?.departmentAnalytics || [];
  const atRiskStudents = data?.atRiskStudents || [];

  const studentChartData = useMemo(() => {
    return performance.map((student) => ({
      name: student.studentId,
      gpa: Number(student.gpa || 0),
      attendance: Number(student.attendancePercentage || 0),
      quiz: Number(student.quizAverage || 0),
    }));
  }, [performance]);

  const departmentChartData = useMemo(() => {
    return departmentAnalytics.map((department) => ({
      name:
        department.department.length > 12
          ? department.department.substring(0, 12) + "..."
          : department.department,
      gpa: Number(department.averageGPA || 0),
      attendance: Number(
        department.averageAttendance || 0
      ),
      quiz: Number(
        department.averageQuizScore || 0
      ),
    }));
  }, [departmentAnalytics]);

  const performanceDistribution = useMemo(() => {
    const excellent = performance.filter(
      (student) => Number(student.gpa) >= 9
    ).length;

    const good = performance.filter(
      (student) =>
        Number(student.gpa) >= 7 &&
        Number(student.gpa) < 9
    ).length;

    const average = performance.filter(
      (student) =>
        Number(student.gpa) >= 5 &&
        Number(student.gpa) < 7
    ).length;

    const needsImprovement = performance.filter(
      (student) => Number(student.gpa) < 5
    ).length;

    return [
      {
        name: "Excellent",
        value: excellent,
      },
      {
        name: "Good",
        value: good,
      },
      {
        name: "Average",
        value: average,
      },
      {
        name: "Needs Improvement",
        value: needsImprovement,
      },
    ].filter((item) => item.value > 0);
  }, [performance]);

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
  ];

  if (loading) {
    return (
      <Layout
        role="admin"
        title="Dashboard"
        description="Overview of your institution"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading dashboard...
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
        title="Dashboard"
        description="Overview of your institution"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchDashboardData}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      role="admin"
      title="Dashboard"
      description="Overview of your institution"
    >
      <div className="space-y-6">

        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome, Admin
              </h1>

              <span className="text-2xl">👋</span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening across your institution today.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <CalendarDays className="h-4 w-4 text-violet-500" />

            <span className="text-sm font-medium text-slate-600">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* KPI CARDS */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Students */}
          <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg shadow-blue-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Total Students
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {summary.totalStudents ?? 0}
                </h2>
              </div>

              <div className="rounded-xl bg-white/20 p-3">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-blue-100">
              <ArrowUpRight className="h-4 w-4" />
              <span>Students registered</span>
            </div>
          </div>

          {/* Faculty */}
          <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-lg shadow-violet-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-violet-100">
                  Faculty
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  --
                </h2>
              </div>

              <div className="rounded-xl bg-white/20 p-3">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-violet-100">
              <UserRound className="h-4 w-4" />
              <span>Faculty management</span>
            </div>
          </div>

          {/* Courses */}
          <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 p-5 text-white shadow-lg shadow-orange-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">
                  Total Courses
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  --
                </h2>
              </div>

              <div className="rounded-xl bg-white/20 p-3">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-orange-100">
              <BookOpen className="h-4 w-4" />
              <span>Academic courses</span>
            </div>
          </div>

          {/* GPA */}
          <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white shadow-lg shadow-emerald-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">
                  Average GPA
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {summary.averageGPA
                    ? Number(summary.averageGPA).toFixed(2)
                    : "0.00"}
                </h2>
              </div>

              <div className="rounded-xl bg-white/20 p-3">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-emerald-100">
              <Award className="h-4 w-4" />
              <span>Institution average</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* SECONDARY STATISTICS */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average Attendance
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.averageAttendance ?? 0}%
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${Math.min(
                    Number(summary.averageAttendance || 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average Quiz Score
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.averageQuizScore ?? 0}%
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3">
                <BarChart3 className="h-5 w-5 text-violet-600" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{
                  width: `${Math.min(
                    Number(summary.averageQuizScore || 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-500">
                  At-Risk Students
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {summary.atRiskStudents ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>

            <p className="mt-4 text-xs text-red-500">
              Students requiring attention
            </p>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* CHARTS */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Performance Trend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Student Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  GPA, attendance and quiz performance
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="h-[300px] w-full">
              {studentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={studentChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 10px 30px rgba(15,23,42,0.08)",
                      }}
                    />

                    <Bar
                      dataKey="gpa"
                      name="GPA"
                      fill="#3b82f6"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="attendance"
                      name="Attendance"
                      fill="#8b5cf6"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="quiz"
                      name="Quiz"
                      fill="#10b981"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No performance data available" />
              )}
            </div>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-bold text-slate-900">
                Student Distribution
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Based on GPA performance
              </p>
            </div>

            <div className="h-[220px]">
              {performanceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {performanceDistribution.map(
                        (_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index]}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No students available" />
              )}
            </div>

            <div className="space-y-3">
              {performanceDistribution.map(
                (item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index],
                        }}
                      />

                      <span className="text-xs text-slate-600">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-800">
                      {item.value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* DEPARTMENT + ACTIVITIES */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Department Performance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Department Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Average GPA by department
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-2.5">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>
            </div>

            <div className="h-[270px]">
              {departmentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 10]}
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Bar
                      dataKey="gpa"
                      name="Average GPA"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No department data available" />
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Activities
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest activity across the platform
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-2.5">
                <Activity className="h-5 w-5 text-violet-600" />
              </div>
            </div>

            <div className="space-y-4">

              <ActivityItem
                icon={<Users className="h-4 w-4" />}
                bg="bg-blue-50"
                color="text-blue-600"
                title="Student management"
                description={`${summary.totalStudents || 0} student(s) currently registered`}
              />

              <ActivityItem
                icon={<GraduationCap className="h-4 w-4" />}
                bg="bg-violet-50"
                color="text-violet-600"
                title="Academic performance"
                description={`Average GPA is ${
                  summary.averageGPA
                    ? Number(summary.averageGPA).toFixed(2)
                    : "0.00"
                }`}
              />

              <ActivityItem
                icon={<Activity className="h-4 w-4" />}
                bg="bg-emerald-50"
                color="text-emerald-600"
                title="Attendance monitoring"
                description={`Average attendance is ${
                  summary.averageAttendance || 0
                }%`}
              />

              <ActivityItem
                icon={<AlertTriangle className="h-4 w-4" />}
                bg="bg-red-50"
                color="text-red-600"
                title="Risk monitoring"
                description={`${
                  summary.atRiskStudents || 0
                } student(s) currently at risk`}
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* AT RISK STUDENTS */}
        {/* ------------------------------------------------ */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Students Requiring Attention
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Students identified by the analytics system
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />

              <span className="text-xs font-semibold text-red-600">
                {atRiskStudents.length} At Risk
              </span>
            </div>
          </div>

          {atRiskStudents.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <Award className="h-6 w-6 text-emerald-500" />
              </div>

              <p className="font-semibold text-slate-800">
                No students currently listed
              </p>

              <p className="mt-1 text-sm text-slate-500">
                There are no students requiring attention.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      GPA
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Attendance
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quiz
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {atRiskStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                            {student.studentId
                              ?.substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            {student.studentId}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {student.department}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">
                          {Number(student.gpa || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`font-semibold ${
                            Number(
                              student.attendancePercentage
                            ) < 75
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {student.attendancePercentage || 0}%
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {student.quizAverage || 0}%
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                          Attention Required
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* QUICK ACTIONS */}
        {/* ------------------------------------------------ */}

        <div>
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Frequently used administration tools
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <QuickAction
              href="/admin-students"
              icon={<Users className="h-5 w-5" />}
              title="Manage Students"
              description="View students"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
            />

            <QuickAction
              href="/admin-courses"
              icon={<BookOpen className="h-5 w-5" />}
              title="Manage Courses"
              description="View courses"
              className="bg-orange-50 text-orange-600 hover:bg-orange-100"
            />

            <QuickAction
              href="/faculty-students"
              icon={<GraduationCap className="h-5 w-5" />}
              title="Faculty Portal"
              description="Faculty management"
              className="bg-violet-50 text-violet-600 hover:bg-violet-100"
            />

            <QuickAction
              href="/faculty-analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              title="View Analytics"
              description="Detailed analytics"
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            />

          </div>
        </div>
      </div>
    </Layout>
  );
}


/* ===================================================== */
/* ACTIVITY ITEM */
/* ===================================================== */

function ActivityItem({
  icon,
  bg,
  color,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}


/* ===================================================== */
/* QUICK ACTION */
/* ===================================================== */

function QuickAction({
  href,
  icon,
  title,
  description,
  className,
}) {
  return (
    <a
      href={href}
      className={`group rounded-2xl border border-transparent p-4 transition duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-xl bg-white/80 p-2.5">
          {icon}
        </div>

        <ArrowUpRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <p className="text-sm font-bold">
        {title}
      </p>

      <p className="mt-1 text-xs opacity-70">
        {description}
      </p>
    </a>
  );
}


/* ===================================================== */
/* EMPTY CHART */
/* ===================================================== */

function EmptyChart({ message }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <BarChart3 className="mx-auto h-8 w-8 text-slate-300" />

        <p className="mt-2 text-sm text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;