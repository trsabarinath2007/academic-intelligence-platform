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

const StudentDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      // ==========================================
      // 1. STUDENT ANALYTICS
      // ==========================================

      const response = await fetch(
        "http://localhost:5000/api/student-analytics/student",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch analytics"
        );
      }

      setAnalytics(data);

      // ==========================================
      // 2. COURSE PERFORMANCE
      // ==========================================

      const courseResponse = await fetch(
        "http://localhost:5000/api/course-performance/student",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const courseData = await courseResponse.json();

      if (!courseResponse.ok) {
        throw new Error(
          courseData.message ||
            "Failed to fetch course performance"
        );
      }

      setCoursePerformance(
        courseData.coursePerformance || []
      );

      // ==========================================
      // 3. COURSE ATTENDANCE
      // ==========================================

      const attendanceResponse = await fetch(
        "http://localhost:5000/api/course-attendance/student",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const attendanceData =
        await attendanceResponse.json();

      if (!attendanceResponse.ok) {
        throw new Error(
          attendanceData.message ||
            "Failed to fetch course attendance"
        );
      }

      setCourseAttendance(
        attendanceData.courseAttendance || []
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow">
          <p className="text-lg text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, {analytics.student.studentId} 👋
        </p>
      </div>

      {/* ========================================
          SUMMARY CARDS
      ======================================== */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* GPA */}

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Current GPA
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {analytics.academics.gpa}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {analytics.academics.performanceStatus} Performance
          </p>

        </div>

        {/* ATTENDANCE */}

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-500">
            {analytics.attendance.attendancePercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Below 75%
          </p>

        </div>

        {/* QUIZ */}

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Quiz Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {analytics.quizzes.averagePercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Good
          </p>

        </div>

        {/* ASSIGNMENT */}

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Assignment Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {analytics.assignments.averagePercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Excellent
          </p>

        </div>

      </div>

      {/* ========================================
          RISK ASSESSMENT
      ======================================== */}

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
              {analytics.riskAssessment.riskLevel}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Risk Score
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {analytics.riskAssessment.riskScore} / 100
            </p>

          </div>

        </div>

        {/* RISK FACTORS */}

        {analytics.riskAssessment.riskFactors.length > 0 && (

          <div className="mt-5 rounded-lg bg-yellow-50 p-4">

            {analytics.riskAssessment.riskFactors.map(
              (factor, index) => (

                <p
                  key={index}
                  className="font-medium text-yellow-800"
                >
                  ⚠ {factor}
                </p>

              )
            )}

            <p className="mt-1 text-sm text-yellow-700">
              Improve your attendance to reduce academic risk.
            </p>

          </div>

        )}

      </div>

      {/* ========================================
          COURSE PERFORMANCE
      ======================================== */}

      <div className="mt-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Course Performance
        </h2>

        <div className="h-80 w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={coursePerformance}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Bar
                dataKey="totalMarks"
                fill="#2563eb"
                name="Marks"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================================
          ATTENDANCE BY COURSE
      ======================================== */}

      <div className="mt-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Attendance by Course
        </h2>

        <div className="h-80 w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={courseAttendance}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Bar
                dataKey="attendancePercentage"
                fill="#16a34a"
                name="Attendance %"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================================
          ACADEMIC OVERVIEW + QUICK ACTIONS
      ======================================== */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ACADEMIC OVERVIEW */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            Academic Overview
          </h2>

          <div className="mt-5 space-y-4">

            {/* Subjects */}

            <div className="flex justify-between">

              <span className="text-gray-500">
                Total Subjects
              </span>

              <span className="font-semibold">
                {analytics.academics.totalSubjects}
              </span>

            </div>

            {/* Quizzes */}

            <div className="flex justify-between">

              <span className="text-gray-500">
                Quizzes Attempted
              </span>

              <span className="font-semibold">
                {analytics.quizzes.attempted}
              </span>

            </div>

            {/* Assignments */}

            <div className="flex justify-between">

              <span className="text-gray-500">
                Assignments Graded
              </span>

              <span className="font-semibold">
                {analytics.assignments.graded}
              </span>

            </div>

            {/* Attendance */}

            <div className="flex justify-between">

              <span className="text-gray-500">
                Classes Attended
              </span>

              <span className="font-semibold">
                {analytics.attendance.presentClasses} /{" "}
                {analytics.attendance.totalClasses}
              </span>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            Quick Actions
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <button
              className="rounded-lg bg-blue-600 p-4 font-medium text-white hover:bg-blue-700"
            >
              View Courses
            </button>

            <button
              className="rounded-lg bg-purple-600 p-4 font-medium text-white hover:bg-purple-700"
            >
              View Assignments
            </button>

            <button
              className="rounded-lg bg-green-600 p-4 font-medium text-white hover:bg-green-700"
            >
              View Quizzes
            </button>

            <button
              className="rounded-lg bg-gray-800 p-4 font-medium text-white hover:bg-gray-900"
            >
              View Insights
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;