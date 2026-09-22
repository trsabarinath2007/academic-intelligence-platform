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
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState([]);
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
              "Failed to fetch dashboard data"
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
              "Failed to fetch assignment performance"
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="font-medium text-gray-600">
            Loading your dashboard...
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            !
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  const student = analytics?.student;
  const academics = analytics?.academics;
  const attendance = analytics?.attendance;
  const quizzes = analytics?.quizzes;
  const assignments = analytics?.assignments;
  const risk = analytics?.riskAssessment;

  const studentName =
    JSON.parse(localStorage.getItem("user") || "{}")?.name ||
    "Student";

  return (
    <Layout
      role="student"
      title="Student Dashboard"
      description="Overview of your academic performance"
    >

      {/* ================================================= */}
      {/* WELCOME SECTION */}
      {/* ================================================= */}

      <section className="mb-8">

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg lg:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-medium text-blue-100">
                Welcome back
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Hello, {studentName} 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Here's a quick overview of your academic
                performance and progress.
              </p>

            </div>

            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur">

              <p className="text-xs text-blue-100">
                Student ID
              </p>

              <p className="mt-1 text-lg font-bold">
                {student?.studentId || "—"}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* STUDENT INFORMATION */}
      {/* ================================================= */}

      <section className="mb-8">

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Department
            </p>

            <p className="mt-2 text-lg font-bold text-gray-800">
              {student?.department || "—"}
            </p>

          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Semester
            </p>

            <p className="mt-2 text-lg font-bold text-gray-800">
              Semester {student?.semester || "—"}
            </p>

          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Performance Status
            </p>

            <p className="mt-2 text-lg font-bold text-blue-600">
              {academics?.performanceStatus || "—"}
            </p>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* KPI CARDS */}
      {/* ================================================= */}

      <section className="mb-8">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* GPA */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Overall GPA
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {academics?.gpa ?? "—"}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                ★
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-400">
              Based on {academics?.totalSubjects || 0} subjects
            </p>

          </div>


          {/* Attendance */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {attendance?.attendancePercentage ?? 0}%
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                ◷
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-400">
              {attendance?.presentClasses || 0} of{" "}
              {attendance?.totalClasses || 0} classes attended
            </p>

          </div>


          {/* Quiz */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Quiz Average
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {quizzes?.averagePercentage ?? 0}%
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                ✓
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-400">
              {quizzes?.attempted || 0} quiz
              {quizzes?.attempted === 1 ? "" : "zes"} attempted
            </p>

          </div>


          {/* Assignments */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Assignment Average
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {assignments?.averagePercentage ?? 0}%
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-600">
                □
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-400">
              {assignments?.graded || 0} graded assignment
              {assignments?.graded === 1 ? "" : "s"}
            </p>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* RISK ASSESSMENT */}
      {/* ================================================= */}

      <section className="mb-8">

        <div
          className={`rounded-2xl border p-6 ${
            risk?.riskLevel === "Low Risk"
              ? "border-green-200 bg-green-50"
              : risk?.riskLevel === "Medium Risk"
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
          }`}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Academic Risk Assessment
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {risk?.riskLevel || "Not Available"}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Your current academic risk score is{" "}
                <span className="font-bold">
                  {risk?.riskScore ?? 0}
                </span>
                .
              </p>

            </div>

            <div className="rounded-xl bg-white px-6 py-4 shadow-sm">

              <p className="text-xs font-medium text-gray-500">
                Risk Score
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {risk?.riskScore ?? 0}
              </p>

            </div>

          </div>

          {risk?.riskFactors?.length > 0 && (

            <div className="mt-5 border-t border-gray-200/70 pt-5">

              <p className="mb-2 text-sm font-semibold text-gray-700">
                Factors
              </p>

              <ul className="space-y-1">

                {risk.riskFactors.map(
                  (factor, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600"
                    >
                      • {factor}
                    </li>
                  )
                )}

              </ul>

            </div>

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* CHARTS ROW 1 */}
      {/* ================================================= */}

      <section className="mb-8 grid gap-6 lg:grid-cols-2">

        {/* Course Performance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Course Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your marks across different courses.
            </p>

          </div>

          <div className="h-80">

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
                />

                <XAxis
                  dataKey="courseCode"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
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

          </div>

        </div>


        {/* Attendance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Course Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Attendance percentage by course.
            </p>

          </div>

          <div className="h-80">

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
                />

                <XAxis
                  dataKey="courseCode"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
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

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* CHARTS ROW 2 */}
      {/* ================================================= */}

      <section className="mb-8 grid gap-6 lg:grid-cols-2">

        {/* Quiz */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Quiz Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your quiz scores over time.
            </p>

          </div>

          <div className="h-72">

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
                  />

                  <XAxis
                    dataKey="quizTitle"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#9333ea"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    name="Score"
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center">

                <p className="text-sm text-gray-400">
                  No quiz data available.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* Assignments */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900">
              Assignment Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your assignment scores.
            </p>

          </div>

          <div className="h-72">

            {assignmentPerformance.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={assignmentPerformance}
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
                  />

                  <XAxis
                    dataKey="assignmentTitle"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="marksObtained"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    name="Marks"
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center">

                <p className="text-sm text-gray-400">
                  No assignment data available.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ACADEMIC OVERVIEW */}
      {/* ================================================= */}

      <section className="mb-8">

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5">

            <h2 className="text-lg font-bold text-gray-900">
              Academic Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Summary of your current academic activity.
            </p>

          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <p className="text-sm text-gray-500">
                Subjects
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {academics?.totalSubjects || 0}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Classes Attended
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {attendance?.presentClasses || 0}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Quizzes Attempted
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {quizzes?.attempted || 0}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Assignments Graded
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {assignments?.graded || 0}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <section>

        <div className="mb-5">

          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access your academic information.
          </p>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <button
            onClick={() =>
              (window.location.href =
                "/student-profile")
            }
            className="group rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              ◉
            </div>

            <h3 className="font-semibold text-gray-900">
              My Profile
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View your student profile.
            </p>

          </button>


          <button
            onClick={() =>
              (window.location.href =
                "/academic-records")
            }
            className="group rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              ▥
            </div>

            <h3 className="font-semibold text-gray-900">
              Academic Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View your marks and grades.
            </p>

          </button>


          <button
            onClick={() =>
              (window.location.href =
                "/attendance")
            }
            className="group rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              ◷
            </div>

            <h3 className="font-semibold text-gray-900">
              Attendance
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Check your attendance details.
            </p>

          </button>


          <button
            onClick={() =>
              (window.location.href =
                "/performance-insights")
            }
            className="group rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              ↗
            </div>

            <h3 className="font-semibold text-gray-900">
              Performance Insights
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View personalized insights.
            </p>

          </button>

        </div>

      </section>

    </Layout>
  );
}

export default StudentDashboard;