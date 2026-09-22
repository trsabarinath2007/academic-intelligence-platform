import React, { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import Layout from "../components/Layout";

function StudentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [coursePerformance, setCoursePerformance] =
    useState([]);
  const [courseAttendance, setCourseAttendance] =
    useState([]);
  const [quizPerformance, setQuizPerformance] =
    useState([]);
  const [assignmentPerformance, setAssignmentPerformance] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          analyticsResponse,
          courseResponse,
          attendanceResponse,
          quizResponse,
          assignmentResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/student-analytics/student",
            { headers }
          ),

          fetch(
            "http://localhost:5000/api/course-performance/student",
            { headers }
          ),

          fetch(
            "http://localhost:5000/api/course-attendance/student",
            { headers }
          ),

          fetch(
            "http://localhost:5000/api/quiz-performance/student",
            { headers }
          ),

          fetch(
            "http://localhost:5000/api/assignment-performance/student",
            { headers }
          ),
        ]);

        const [
          analyticsData,
          courseData,
          attendanceData,
          quizData,
          assignmentData,
        ] = await Promise.all([
          analyticsResponse.json(),
          courseResponse.json(),
          attendanceResponse.json(),
          quizResponse.json(),
          assignmentResponse.json(),
        ]);

        if (!analyticsResponse.ok) {
          throw new Error(
            analyticsData.message ||
              "Failed to fetch dashboard"
          );
        }

        if (!courseResponse.ok) {
          throw new Error(
            courseData.message ||
              "Failed to fetch course performance"
          );
        }

        if (!attendanceResponse.ok) {
          throw new Error(
            attendanceData.message ||
              "Failed to fetch attendance"
          );
        }

        if (!quizResponse.ok) {
          throw new Error(
            quizData.message ||
              "Failed to fetch quiz performance"
          );
        }

        if (!assignmentResponse.ok) {
          throw new Error(
            assignmentData.message ||
              "Failed to fetch assignments"
          );
        }

        setAnalytics(analyticsData);

        setCoursePerformance(
          courseData.coursePerformance || []
        );

        setCourseAttendance(
          attendanceData.courseAttendance || []
        );

        setQuizPerformance(
          quizData.quizPerformance || []
        );

        setAssignmentPerformance(
          assignmentData.assignmentPerformance || []
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-600">
            Loading your dashboard...
          </p>

        </div>

      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
            !
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  /* ================= DATA ================= */

  const student = analytics?.student;
  const academics = analytics?.academics;
  const attendance = analytics?.attendance;
  const quizzes = analytics?.quizzes;
  const assignments = analytics?.assignments;
  const risk = analytics?.riskAssessment;

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const studentName =
    user?.name || "Student";

  /* ================= CHART DATA ================= */

  const assignmentChartData =
    assignmentPerformance.map((item) => ({
      ...item,
      percentage:
        item.totalMarks > 0
          ? Math.round(
              (item.marksObtained /
                item.totalMarks) *
                100
            )
          : 0,
    }));

  return (
    <Layout
      role="student"
      title="Student Dashboard"
      description="Overview of your academic performance"
    >

      {/* ================================================= */}
      {/* WELCOME */}
      {/* ================================================= */}

      <section className="mb-6">

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">

          {/* Decorative shapes */}

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute -bottom-20 right-24 h-52 w-52 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-blue-100">
                Welcome back 👋
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Hello, {studentName}
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-blue-100">
                Keep track of your academic progress,
                attendance, quizzes and assignments from
                one place.
              </p>

            </div>

            <div className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">

              <p className="text-xs text-blue-100">
                Student ID
              </p>

              <p className="mt-1 text-xl font-bold">
                {student?.studentId || "—"}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* BASIC INFORMATION */}
      {/* ================================================= */}

      <section className="mb-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <InfoCard
            label="Department"
            value={
              student?.department || "—"
            }
          />

          <InfoCard
            label="Semester"
            value={`Semester ${
              student?.semester || "—"
            }`}
          />

          <InfoCard
            label="Performance Status"
            value={
              academics?.performanceStatus ||
              "—"
            }
            valueClass="text-blue-600"
          />

        </div>

      </section>


      {/* ================================================= */}
      {/* KPI CARDS */}
      {/* ================================================= */}

      <section className="mb-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Overall GPA"
            value={academics?.gpa ?? "—"}
            subtitle={`Based on ${
              academics?.totalSubjects || 0
            } subjects`}
            icon="★"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Attendance"
            value={`${attendance?.attendancePercentage ?? 0}%`}
            subtitle={`${attendance?.presentClasses || 0} of ${
              attendance?.totalClasses || 0
            } classes attended`}
            icon="◷"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Quiz Average"
            value={`${quizzes?.averagePercentage ?? 0}%`}
            subtitle={`${quizzes?.attempted || 0} quiz${
              quizzes?.attempted === 1
                ? ""
                : "zes"
            } attempted`}
            icon="✓"
            iconClass="bg-purple-50 text-purple-600"
          />

          <StatCard
            title="Assignment Average"
            value={`${assignments?.averagePercentage ?? 0}%`}
            subtitle={`${assignments?.graded || 0} graded assignment${
              assignments?.graded === 1
                ? ""
                : "s"
            }`}
            icon="□"
            iconClass="bg-orange-50 text-orange-600"
          />

        </div>

      </section>


      {/* ================================================= */}
      {/* RISK ASSESSMENT */}
      {/* ================================================= */}

      <section className="mb-6">

        <div
          className={`rounded-2xl border p-5 sm:p-6 ${
            risk?.riskLevel === "Low Risk"
              ? "border-emerald-200 bg-emerald-50"
              : risk?.riskLevel === "Medium Risk"
              ? "border-amber-200 bg-amber-50"
              : "border-red-200 bg-red-50"
          }`}
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Academic Risk Assessment
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {risk?.riskLevel ||
                  "Not Available"}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Your current academic risk score is{" "}
                <strong>
                  {risk?.riskScore ?? 0}
                </strong>
                .
              </p>

            </div>

            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-white shadow-sm">

              <span className="text-xs text-gray-400">
                Score
              </span>

              <span className="text-2xl font-bold text-gray-900">
                {risk?.riskScore ?? 0}
              </span>

            </div>

          </div>

          {risk?.riskFactors?.length > 0 && (

            <div className="mt-5 border-t border-gray-200/70 pt-4">

              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                Risk Factors
              </p>

              <div className="flex flex-wrap gap-2">

                {risk.riskFactors.map(
                  (factor, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm"
                    >
                      {factor}
                    </span>
                  )
                )}

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* CHARTS */}
      {/* ================================================= */}

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Course Performance */}

        <ChartCard
          title="Course Performance"
          description="Your marks across different courses."
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={coursePerformance}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="courseCode"
                tick={{
                  fontSize: 11,
                  fill: "#6b7280",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 11,
                  fill: "#6b7280",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="totalMarks"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                name="Marks"
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>


        {/* Attendance */}

        <ChartCard
          title="Course Attendance"
          description="Attendance percentage by course."
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={courseAttendance}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="courseCode"
                tick={{
                  fontSize: 11,
                  fill: "#6b7280",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 11,
                  fill: "#6b7280",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="attendancePercentage"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
                name="Attendance"
              />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>


        {/* Quiz */}

        <ChartCard
          title="Quiz Performance"
          description="Your quiz scores."
        >

          {quizPerformance.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={quizPerformance}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="quizTitle"
                  tick={{
                    fontSize: 10,
                    fill: "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#9333ea",
                  }}
                  name="Score"
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (
            <EmptyChart text="No quiz data available." />
          )}

        </ChartCard>


        {/* Assignments */}

        <ChartCard
          title="Assignment Performance"
          description="Your assignment scores."
        >

          {assignmentChartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={assignmentChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="assignmentTitle"
                  tick={{
                    fontSize: 10,
                    fill: "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="percentage"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                  name="Percentage"
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (
            <EmptyChart text="No assignment data available." />
          )}

        </ChartCard>

      </section>


      {/* ================================================= */}
      {/* COURSE SUMMARY TABLE */}
      {/* ================================================= */}

      <section className="mb-6">

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

            <h2 className="text-lg font-bold text-gray-900">
              Course Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your academic performance by course.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Course
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Marks
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Grade
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Attendance
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {coursePerformance.map(
                  (course, index) => {

                    const attendanceData =
                      courseAttendance.find(
                        (item) =>
                          item.courseCode ===
                          course.courseCode
                      );

                    return (
                      <tr
                        key={index}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <div>

                            <p className="font-semibold text-gray-900">
                              {course.courseCode}
                            </p>

                            <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                              {course.courseName}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-gray-800">
                          {course.totalMarks}
                        </td>

                        <td className="px-5 py-4 text-center">

                          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                            {course.grade}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-center font-medium text-gray-700">
                          {attendanceData?.attendancePercentage ??
                            0}
                          %
                        </td>

                        <td className="px-5 py-4 text-center">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              course.performanceLevel ===
                              "Excellent"
                                ? "bg-emerald-50 text-emerald-700"
                                : course.performanceLevel ===
                                  "Good"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {course.performanceLevel ||
                              "Good"}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ACADEMIC OVERVIEW */}
      {/* ================================================= */}

      <section className="mb-6">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-gray-900">
              Academic Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Summary of your current academic activity.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">

            <OverviewItem
              label="Subjects"
              value={
                academics?.totalSubjects || 0
              }
            />

            <OverviewItem
              label="Classes Attended"
              value={
                attendance?.presentClasses || 0
              }
            />

            <OverviewItem
              label="Quizzes Attempted"
              value={
                quizzes?.attempted || 0
              }
            />

            <OverviewItem
              label="Assignments Graded"
              value={
                assignments?.graded || 0
              }
            />

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access your academic information.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <QuickAction
            title="My Profile"
            description="View your student profile."
            icon="◉"
            iconClass="bg-blue-50 text-blue-600"
            path="/student-profile"
          />

          <QuickAction
            title="Academic Records"
            description="View your marks and grades."
            icon="▥"
            iconClass="bg-purple-50 text-purple-600"
            path="/academic-records"
          />

          <QuickAction
            title="Attendance"
            description="Check your attendance details."
            icon="◷"
            iconClass="bg-emerald-50 text-emerald-600"
            path="/attendance"
          />

          <QuickAction
            title="Performance Insights"
            description="View personalized insights."
            icon="↗"
            iconClass="bg-orange-50 text-orange-600"
            path="/performance-insights"
          />

        </div>

      </section>

    </Layout>
  );
}


/* ================================================= */
/* COMPONENTS */
/* ================================================= */

function InfoCard({
  label,
  value,
  valueClass = "text-gray-900",
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">

      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-base font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}


function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 truncate text-xs text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}


function ChartCard({
  title,
  description,
  children,
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-5">

        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>

      </div>

      <div className="h-[280px] min-w-0 sm:h-[320px]">
        {children}
      </div>

    </div>
  );
}


function EmptyChart({ text }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">

      <p className="text-sm text-gray-400">
        {text}
      </p>

    </div>
  );
}


function OverviewItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}


function QuickAction({
  title,
  description,
  icon,
  iconClass,
  path,
}) {
  return (
    <button
      onClick={() => {
        window.location.href = path;
      }}
      className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md"
    >

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-gray-500">
        {description}
      </p>

      <p className="mt-4 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
        Open →
      </p>

    </button>
  );
}


export default StudentDashboard;