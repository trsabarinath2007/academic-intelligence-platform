import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchFacultyData =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {
            throw new Error(
              "Please login first."
            );
          }

          const response =
            await fetch(
              "http://localhost:5000/api/admin-analytics/overall-performance",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Failed to fetch faculty analytics"
            );
          }

          setData(result);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchFacultyData();
  }, []);

  // =====================================================
  // DATA
  // =====================================================

  const summary =
    data?.summary || {};

  const performance =
    data?.performance || [];

  const atRiskStudents =
    data?.atRiskStudents || [];

  const departmentAnalytics =
    data?.departmentAnalytics ||
    [];

  // =====================================================
  // CHART DATA
  // =====================================================

  const studentChartData =
    useMemo(() => {
      return performance.map(
        (student) => ({
          studentId:
            student.studentId,
          gpa:
            Number(
              student.gpa
            ) || 0,
        })
      );
    }, [performance]);

  const departmentChartData =
    useMemo(() => {
      return departmentAnalytics.map(
        (department) => ({
          department:
            department.department ||
            "Unknown",
          averageGPA:
            Number(
              department.averageGPA
            ) || 0,
        })
      );
    }, [
      departmentAnalytics,
    ]);

  // =====================================================
  // DATE
  // =====================================================

  const today =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  // =====================================================
  // ICON
  // =====================================================

  const Icon = ({
    type,
    size = 20,
  }) => {
    const props = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    switch (type) {
      case "search":
        return (
          <svg {...props}>
            <circle
              cx="11"
              cy="11"
              r="6"
            />
            <path d="m16 16 4 4" />
          </svg>
        );

      case "bell":
        return (
          <svg {...props}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        );

      case "students":
        return (
          <svg {...props}>
            <circle
              cx="9"
              cy="8"
              r="3"
            />
            <path d="M3.5 20c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5" />
            <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          </svg>
        );

      case "gpa":
        return (
          <svg {...props}>
            <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
            <path d="M6 12v5c3 2.2 9 2.2 12 0v-5" />
          </svg>
        );

      case "attendance":
        return (
          <svg {...props}>
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
            />
            <path d="M7 3v4" />
            <path d="M17 3v4" />
            <path d="M3 10h18" />
            <path d="m8 15 2 2 5-5" />
          </svg>
        );

      case "quiz":
        return (
          <svg {...props}>
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
            />
            <path d="M8 8h8" />
            <path d="M8 12h2" />
            <path d="M14 12h2" />
          </svg>
        );

      case "warning":
        return (
          <svg {...props}>
            <path d="m12 4 9 16H3L12 4Z" />
            <path d="M12 9v5" />
            <path d="M12 18h.01" />
          </svg>
        );

      case "spark":
        return (
          <svg {...props}>
            <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
          </svg>
        );

      case "chart":
        return (
          <svg {...props}>
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
          </svg>
        );

      case "arrow":
        return (
          <svg {...props}>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        );

      default:
        return null;
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getInitial = (
    value
  ) => {
    return String(
      value || "S"
    )
      .charAt(0)
      .toUpperCase();
  };

  const getAttentionLevel = (
    attendance,
    gpa
  ) => {
    const attendanceValue =
      Number(
        attendance
      ) || 0;

    const gpaValue =
      Number(gpa) || 0;

    if (
      attendanceValue < 60 ||
      gpaValue < 6.5
    ) {
      return {
        label:
          "High Attention",
        className:
          "bg-red-50 text-red-600",
      };
    }

    return {
      label: "Monitor",
      className:
        "bg-amber-50 text-amber-600",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="text-lg font-semibold text-slate-500">
          Loading faculty dashboard...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

          <h1 className="text-xl font-bold text-red-600">
            Error
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-xl bg-[#315EFB] px-5 py-3 font-semibold text-white"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#315EFB]">
                Faculty Portal
              </span>

              <span className="text-xs text-slate-300">
                •
              </span>

              <span className="text-xs text-slate-400">
                {today}
              </span>

            </div>

            <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.04em] text-slate-900">
              Good morning, Faculty
              <span className="ml-2">
                ☀️
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's a quick overview of your students' academic performance.
            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="hidden h-11 w-[270px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 shadow-sm lg:flex">

              <Icon
                type="search"
                size={18}
              />

              <input
                type="text"
                placeholder="Search students..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

            {/* NOTIFICATION */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/notifications"
                )
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-[#315EFB]"
            >

              <Icon
                type="bell"
                size={19}
              />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

            </button>

            {/* USER */}

            <div className="hidden h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 shadow-sm sm:flex">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#315EFB]">
                F
              </div>

              <div>

                <p className="text-xs font-bold text-slate-800">
                  Faculty
                </p>

                <p className="text-[10px] text-slate-400">
                  Academic Staff
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* STUDENTS */}

          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-[#F1F5FF] to-white p-5 shadow-sm">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#E5ECFF]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Icon
                    type="students"
                    size={21}
                  />
                </div>

                <span className="text-[10px] font-bold text-emerald-500">
                  ACTIVE
                </span>

              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                Total Students
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {summary.totalStudents ||
                  0}
              </p>

              <p className="mt-1 text-xs text-emerald-500">
                ↗ Registered students
              </p>

            </div>

          </div>

          {/* GPA */}

          <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-[#F6F0FF] to-white p-5 shadow-sm">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#EDE4FF]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                  <Icon
                    type="gpa"
                    size={21}
                  />
                </div>

                <span className="text-[10px] font-bold text-violet-500">
                  / 10
                </span>

              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                Average GPA
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {summary.averageGPA ||
                  0}
              </p>

              <p className="mt-1 text-xs text-emerald-500">
                ↗ Class average
              </p>

            </div>

          </div>

          {/* ATTENDANCE */}

          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#F0FBF6] to-white p-5 shadow-sm">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#E2F8EE]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                  <Icon
                    type="attendance"
                    size={21}
                  />
                </div>

                <span
                  className={`text-[10px] font-bold ${
                    Number(
                      summary.averageAttendance
                    ) < 75
                      ? "text-red-500"
                      : "text-emerald-500"
                  }`}
                >
                  {Number(
                    summary.averageAttendance
                  ) < 75
                    ? "ATTENTION"
                    : "HEALTHY"}
                </span>

              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                Average Attendance
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {summary.averageAttendance ||
                  0}
                %
              </p>

              <p
                className={`mt-1 text-xs font-semibold ${
                  Number(
                    summary.averageAttendance
                  ) < 75
                    ? "text-red-500"
                    : "text-emerald-500"
                }`}
              >
                {Number(
                  summary.averageAttendance
                ) < 75
                  ? "Below 75% threshold"
                  : "Attendance on track"}
              </p>

            </div>

          </div>

          {/* QUIZ */}

          <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-[#FFF7EC] to-white p-5 shadow-sm">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#FFF0D7]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                  <Icon
                    type="quiz"
                    size={21}
                  />
                </div>

                <span className="text-[10px] font-bold text-orange-500">
                  ASSESSMENT
                </span>

              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                Average Quiz Score
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {summary.averageQuizScore ||
                  0}
                %
              </p>

              <p className="mt-1 text-xs text-emerald-500">
                ↗ Assessment performance
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            GPA + ATTENTION
        ================================================= */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

          {/* GPA */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-extrabold text-slate-900">
                  Student GPA Performance
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Current GPA distribution across students
                </p>

              </div>

              <span className="rounded-lg bg-[#F3F5FF] px-3 py-1.5 text-xs font-bold text-[#315EFB]">
                GPA / 10
              </span>

            </div>

            <div className="h-[360px] p-5">

              {studentChartData.length >
              0 ? (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      studentChartData
                    }
                  >

                    <CartesianGrid
                      vertical={false}
                      stroke="#EEF1F5"
                      strokeDasharray="4 4"
                    />

                    <XAxis
                      dataKey="studentId"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      domain={[
                        0,
                        10,
                      ]}
                      axisLine={false}
                      tickLine={false}
                      ticks={[
                        0,
                        2,
                        4,
                        6,
                        8,
                        10,
                      ]}
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 11,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="gpa"
                      name="GPA"
                      fill="#4F72E8"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={65}
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No GPA data available.
                </div>
              )}

            </div>

          </section>

          {/* ATTENTION */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-extrabold text-slate-900">
                  Students Requiring Attention
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Students needing follow-up
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Icon
                  type="warning"
                  size={18}
                />
              </div>

            </div>

            <div className="p-4">

              {atRiskStudents.length >
              0 ? (

                <div className="space-y-3">

                  {atRiskStudents
                    .slice(0, 5)
                    .map(
                      (
                        student,
                        index
                      ) => {

                        const attention =
                          getAttentionLevel(
                            student.attendancePercentage,
                            student.gpa
                          );

                        return (
                          <div
                            key={
                              student._id ||
                              student.studentId ||
                              index
                            }
                            className="rounded-xl border border-slate-100 bg-[#FCFCFE] p-4"
                          >

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-extrabold text-[#315EFB]">
                                {getInitial(
                                  student.studentId
                                )}
                              </div>

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between">

                                  <p className="text-sm font-bold text-slate-800">
                                    {student.studentId ||
                                      "Student"}
                                  </p>

                                  <span className="text-sm font-extrabold text-red-500">
                                    {student.attendancePercentage ??
                                      0}
                                    %
                                  </span>

                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                  {student.department ||
                                    "Department"}
                                </p>

                              </div>

                            </div>

                            <div className="mt-3 flex items-center justify-between">

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${attention.className}`}
                              >
                                {attention.label}
                              </span>

                              <span className="text-xs font-bold text-slate-500">
                                GPA{" "}
                                {student.gpa ??
                                  0}
                              </span>

                            </div>

                          </div>
                        );
                      }
                    )}

                </div>

              ) : (

                <div className="flex h-[290px] items-center justify-center text-center">

                  <div>

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      ✓
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-800">
                      No students flagged
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Current indicators look stable.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </section>

        </section>

        {/* =================================================
            CLASS OVERVIEW
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="text-lg font-extrabold text-slate-900">
                Class Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current academic health indicators
              </p>

            </div>

            <span className="text-xs text-slate-400">
              Live analytics
            </span>

          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3">

            <div className="rounded-xl bg-[#F2FBF7] p-5">

              <p className="text-xs font-semibold text-emerald-600">
                ● High Performers
              </p>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {summary.highPerformers ||
                  0}
              </p>

            </div>

            <div className="rounded-xl bg-[#FFF9ED] p-5">

              <p className="text-xs font-semibold text-amber-600">
                ● Need Improvement
              </p>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {summary.studentsNeedingImprovement ||
                  0}
              </p>

            </div>

            <div className="rounded-xl bg-[#FFF3F3] p-5">

              <p className="text-xs font-semibold text-red-600">
                ● At Risk
              </p>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {summary.atRiskStudents ||
                  0}
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            DEPARTMENT ANALYTICS
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="text-lg font-extrabold text-slate-900">
                Department Performance
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Average GPA across departments
              </p>

            </div>

            <Icon
              type="chart"
              size={18}
            />

          </div>

          <div className="h-[300px] p-6">

            {departmentChartData.length >
            0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={
                    departmentChartData
                  }
                  layout="vertical"
                >

                  <CartesianGrid
                    horizontal={false}
                    stroke="#EEF1F5"
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    type="number"
                    domain={[
                      0,
                      10,
                    ]}
                    ticks={[
                      0,
                      2,
                      4,
                      6,
                      8,
                      10,
                    ]}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="department"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="averageGPA"
                    name="Average GPA"
                    fill="#8B68EA"
                    radius={[
                      0,
                      8,
                      8,
                      0,
                    ]}
                    maxBarSize={24}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No department data available.
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default FacultyDashboard;