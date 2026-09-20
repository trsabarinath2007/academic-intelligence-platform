import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        // --------------------------------
        // 1. Student Analytics
        // --------------------------------
        const analyticsResponse = await fetch(
          "http://localhost:5000/api/student-analytics/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const analyticsData =
          await analyticsResponse.json();

        if (!analyticsResponse.ok) {
          throw new Error(
            analyticsData.message ||
              "Failed to fetch student analytics"
          );
        }

        setAnalytics(analyticsData);

        // --------------------------------
        // 2. Course Performance
        // --------------------------------
        const performanceResponse = await fetch(
          "http://localhost:5000/api/course-performance/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const performanceData =
          await performanceResponse.json();

        if (!performanceResponse.ok) {
          throw new Error(
            performanceData.message ||
              "Failed to fetch course performance"
          );
        }

        setCoursePerformance(
          performanceData.coursePerformance || []
        );

        // --------------------------------
        // 3. Course Attendance
        // --------------------------------
        const attendanceResponse = await fetch(
          "http://localhost:5000/api/course-attendance/student",
          {
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

        // --------------------------------
        // 4. Quiz Performance
        // --------------------------------
        const quizResponse = await fetch(
          "http://localhost:5000/api/quiz-performance/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const quizData = await quizResponse.json();

        if (!quizResponse.ok) {
          throw new Error(
            quizData.message ||
              "Failed to fetch quiz performance"
          );
        }

        setQuizPerformance(
          quizData.quizPerformance || []
        );

        // --------------------------------
        // 5. Assignment Performance
        // --------------------------------
        const assignmentResponse = await fetch(
          "http://localhost:5000/api/assignment-performance/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const assignmentData =
          await assignmentResponse.json();

        if (!assignmentResponse.ok) {
          throw new Error(
            assignmentData.message ||
              "Failed to fetch assignment performance"
          );
        }

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

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-xl font-bold text-red-600">
            Error
          </h1>

          <p className="text-gray-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const student = analytics?.student;
  const academics = analytics?.academics;
  const attendance = analytics?.attendance;
  const quizzes = analytics?.quizzes;
  const assignments = analytics?.assignments;
  const riskAssessment = analytics?.riskAssessment;

  // --------------------------------
  // Assignment chart data
  // --------------------------------
  const assignmentChartData =
    assignmentPerformance.map((assignment) => ({
      ...assignment,
      percentage:
        assignment.totalMarks > 0
          ? Number(
              (
                (assignment.marksObtained /
                  assignment.totalMarks) *
                100
              ).toFixed(2)
            )
          : 0,
    }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* --------------------------------
          Header
      -------------------------------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Academic Intelligence Platform
        </p>
      </div>

      {/* --------------------------------
          Student Information
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Student Information
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Student ID
            </p>

            <p className="font-semibold text-gray-800">
              {student?.studentId || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="font-semibold text-gray-800">
              {student?.department || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Semester
            </p>

            <p className="font-semibold text-gray-800">
              {student?.semester || "-"}
            </p>
          </div>

        </div>
      </div>

      {/* --------------------------------
          Summary Cards
      -------------------------------- */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* GPA */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            GPA
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {academics?.gpa ?? "-"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {academics?.performanceStatus || "-"}
          </p>
        </div>

        {/* Attendance */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {attendance?.attendancePercentage ?? 0}%
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {attendance?.presentClasses ?? 0} /{" "}
            {attendance?.totalClasses ?? 0} classes
          </p>
        </div>

        {/* Quiz */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Quiz Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-600">
            {quizzes?.averagePercentage ?? 0}%
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {quizzes?.attempted ?? 0} attempted
          </p>
        </div>

        {/* Assignment */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Assignment Average
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-600">
            {assignments?.averagePercentage ?? 0}%
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {assignments?.graded ?? 0} graded
          </p>
        </div>

      </div>

      {/* --------------------------------
          Risk Assessment
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Risk Assessment
        </h2>

        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Risk Level
            </p>

            <p className="text-2xl font-bold text-red-600">
              {riskAssessment?.riskLevel || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Risk Score
            </p>

            <p className="text-2xl font-bold text-gray-800">
              {riskAssessment?.riskScore ?? 0}
            </p>
          </div>

        </div>

        {riskAssessment?.riskFactors?.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-gray-700">
              Risk Factors
            </p>

            <ul className="list-disc pl-5 text-gray-600">
              {riskAssessment.riskFactors.map(
                (factor, index) => (
                  <li key={index}>
                    {factor}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      </div>

      {/* --------------------------------
          Course Performance
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Course Performance
        </h2>

        {coursePerformance.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={coursePerformance}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="totalMarks"
                name="Total Marks"
                fill="#3b82f6"
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            No course performance data available.
          </p>
        )}

      </div>

      {/* --------------------------------
          Attendance by Course
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Attendance by Course
        </h2>

        {courseAttendance.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={courseAttendance}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="attendancePercentage"
                name="Attendance %"
                fill="#22c55e"
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            No attendance data available.
          </p>
        )}

      </div>

      {/* --------------------------------
          Quiz Performance
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Quiz Performance
        </h2>

        {quizPerformance.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={quizPerformance}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="percentage"
                name="Quiz Percentage"
                fill="#8b5cf6"
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            No quiz performance data available.
          </p>
        )}

      </div>

      {/* --------------------------------
          Assignment Performance
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Assignment Performance
        </h2>

        {assignmentChartData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={assignmentChartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="courseCode"
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="percentage"
                name="Assignment Percentage"
                fill="#f97316"
              />

            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            No assignment performance data available.
          </p>
        )}

      </div>

      {/* --------------------------------
          Academic Overview
      -------------------------------- */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Academic Overview
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Total Subjects
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {academics?.totalSubjects ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Quizzes Attempted
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {quizzes?.attempted ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Assignments Graded
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {assignments?.graded ?? 0}
            </p>
          </div>

        </div>

      </div>

      {/* --------------------------------
          Quick Actions
      -------------------------------- */}
      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <button
            className="rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              alert("Course performance selected")
            }
          >
            View Course Performance
          </button>

          <button
            className="rounded-lg bg-green-600 p-3 font-semibold text-white hover:bg-green-700"
            onClick={() =>
              alert("Attendance selected")
            }
          >
            View Attendance
          </button>

          <button
            className="rounded-lg bg-purple-600 p-3 font-semibold text-white hover:bg-purple-700"
            onClick={() =>
              alert("Quiz performance selected")
            }
          >
            View Quiz Performance
          </button>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;