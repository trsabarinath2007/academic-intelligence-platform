import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { apiRequest } from "../api";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [coursePerformance, setCoursePerformance] =
    useState([]);
  const [courseAttendance, setCourseAttendance] =
    useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

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

      if (!token) {
        throw new Error("Please login again");
      }

      // Student Analytics
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
          data.message ||
            "Failed to fetch analytics"
        );
      }

      setAnalytics(data);

      // Course Performance
      const courseResponse = await fetch(
        "http://localhost:5000/api/course-performance/student",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const courseData =
        await courseResponse.json();

      if (!courseResponse.ok) {
        throw new Error(
          courseData.message ||
            "Failed to fetch course performance"
        );
      }

      setCoursePerformance(
        courseData.coursePerformance || []
      );

      // Course Attendance
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

      // Quiz Attempts
      const quizResponse = await apiRequest(
        "/quizzes/my-attempts",
        {
          method: "GET",
        }
      );

      setQuizAttempts(
        quizResponse.attempts || []
      );
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const quizTrend = useMemo(() => {
    return [...quizAttempts]
      .reverse()
      .map((attempt, index) => ({
        name:
          attempt.quiz?.title ||
          `Quiz ${index + 1}`,
        percentage: Number(
          attempt.percentage ??
            (
              (Number(attempt.score || 0) /
                Number(
                  attempt.totalMarks || 1
                )) *
              100
            )
        ),
      }));
  }, [quizAttempts]);

  const quizAverage = useMemo(() => {
    if (quizAttempts.length === 0) {
      return 0;
    }

    const total = quizAttempts.reduce(
      (sum, attempt) => {
        const percentage =
          Number(
            attempt.percentage
          ) ||
          (
            (Number(attempt.score || 0) /
              Number(
                attempt.totalMarks || 1
              )) *
            100
          );

        return sum + percentage;
      },
      0
    );

    return (
      total / quizAttempts.length
    ).toFixed(1);
  }, [quizAttempts]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-lg text-red-600">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Welcome back,{" "}
            {analytics.student.studentId} 👋
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
              {analytics.academics.gpa}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {analytics.academics.performanceStatus}{" "}
              Performance
            </p>
          </div>

          {/* Attendance */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {
                analytics.attendance
                  .attendancePercentage
              }
              %
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {analytics.attendance
                .attendancePercentage < 75
                ? "Below 75%"
                : "Good Attendance"}
            </p>
          </div>

          {/* Quiz */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Quiz Average
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {quizAttempts.length > 0
                ? `${quizAverage}%`
                : `${analytics.quizzes.averagePercentage}%`}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {quizAttempts.length} quiz attempt
              {quizAttempts.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {/* Assignment */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Assignment Average
            </p>

            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {
                analytics.assignments
                  .averagePercentage
              }
              %
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {analytics.assignments.performanceLevel ||
                "Performance"}
            </p>
          </div>

        </div>

        {/* Risk Assessment */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-800">
            Risk Assessment
          </h2>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Current Risk Level
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {
                  analytics.riskAssessment
                    .riskLevel
                }
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-gray-500">
                Risk Score
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {
                  analytics.riskAssessment
                    .riskScore
                }{" "}
                / 100
              </p>
            </div>

          </div>

          {analytics.riskAssessment
            .riskFactors?.length > 0 && (
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

              <p className="mt-2 text-sm text-yellow-700">
                Review the above factors and improve the relevant academic activities.
              </p>

            </div>
          )}

        </div>

        {/* Course Performance */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Course Performance
              </h2>

              <p className="text-sm text-gray-500">
                Performance across your courses
              </p>
            </div>

          </div>

          <div className="h-80 w-full">

            {coursePerformance.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                No course performance data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={coursePerformance}
                >

                  <CartesianGrid strokeDasharray="3 3" />

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
                    name="Score %"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            )}

          </div>

        </div>

        {/* Quiz Performance Trend */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Quiz Performance Trend
              </h2>

              <p className="text-sm text-gray-500">
                Track your quiz scores over completed attempts.
              </p>
            </div>

            <div className="rounded-lg bg-green-50 px-5 py-3">

              <p className="text-xs text-gray-500">
                Overall Quiz Average
              </p>

              <p className="text-2xl font-bold text-green-600">
                {quizAttempts.length > 0
                  ? `${quizAverage}%`
                  : `${analytics.quizzes.averagePercentage}%`}
              </p>

            </div>

          </div>

          <div className="h-80 w-full">

            {quizTrend.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                No quiz attempts available yet.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart data={quizTrend}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis
                    domain={[0, 100]}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Score",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />

                </LineChart>
              </ResponsiveContainer>
            )}

          </div>

        </div>

        {/* Academic Overview + Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Academic Overview */}
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
                  {
                    analytics.academics
                      .totalSubjects
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Quizzes Attempted
                </span>

                <span className="font-semibold">
                  {quizAttempts.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Assignments Graded
                </span>

                <span className="font-semibold">
                  {
                    analytics.assignments
                      .graded
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Classes Attended
                </span>

                <span className="font-semibold">
                  {
                    analytics.attendance
                      .presentClasses
                  }{" "}
                  /{" "}
                  {
                    analytics.attendance
                      .totalClasses
                  }
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

              <button
                onClick={() =>
                  navigate("/courses")
                }
                className="rounded-lg bg-blue-600 p-4 font-medium text-white hover:bg-blue-700"
              >
                View Courses
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/student-assignments"
                  )
                }
                className="rounded-lg bg-purple-600 p-4 font-medium text-white hover:bg-purple-700"
              >
                View Assignments
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/student-quizzes"
                  )
                }
                className="rounded-lg bg-green-600 p-4 font-medium text-white hover:bg-green-700"
              >
                View Quizzes
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/performance-insights"
                  )
                }
                className="rounded-lg bg-gray-800 p-4 font-medium text-white hover:bg-gray-900"
              >
                View Insights
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;