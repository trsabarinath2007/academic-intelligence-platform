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

  // --------------------------------
  // Logout
  // --------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // --------------------------------
  // Go to Profile
  // --------------------------------
  const goToProfile = () => {
    window.location.href = "/student-profile";
  };

  // --------------------------------
  // Scroll to Section
  // --------------------------------
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // --------------------------------
  // Fetch Dashboard Data
  // --------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // --------------------------------
        // 1. Student Analytics
        // --------------------------------
        const analyticsResponse = await fetch(
          "http://localhost:5000/api/student-analytics/student",
          {
            headers,
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
            headers,
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
            headers,
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
            headers,
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
            headers,
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
        <div className="text-center">
          <div className="mb-3 text-2xl font-bold text-blue-600">
            Academic Intelligence
          </div>

          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
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

          <p className="mb-5 text-gray-600">
            {error}
          </p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Dashboard Data
  // --------------------------------
  const student = analytics?.student;
  const academics = analytics?.academics;
  const attendance = analytics?.attendance;
  const quizzes = analytics?.quizzes;
  const assignments = analytics?.assignments;
  const riskAssessment = analytics?.riskAssessment;

  // --------------------------------
  // Assignment Chart Data
  // --------------------------------
  const assignmentChartData =
    assignmentPerformance.map((assignment) => ({
      ...assignment,

      percentage:
        assignment.totalMarks > 0 &&
        assignment.marksObtained !== null
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
    <div className="min-h-screen bg-gray-100">

      {/* ==================================
          NAVBAR
      ================================== */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <div>
            <h1 className="text-xl font-bold text-blue-600">
              Academic Intelligence
            </h1>

            <p className="text-xs text-gray-500">
              Student Portal
            </p>
          </div>

          {/* Student Profile + Logout */}
          <div className="flex items-center gap-4">

            <button
              onClick={goToProfile}
              className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-gray-100"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {student?.studentId || "Student"}
                </p>

                <p className="text-xs text-gray-500">
                  {student?.department || ""}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                {student?.studentId
                  ? student.studentId.charAt(0)
                  : "S"}
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* ==================================
          MAIN CONTENT
      ================================== */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Track your academic performance and progress.
          </p>
        </div>

        {/* ==================================
            STUDENT INFORMATION
        ================================== */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Student Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Student ID
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {student?.studentId || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {student?.department || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Semester
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {student?.semester || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* ==================================
            SUMMARY CARDS
        ================================== */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* GPA */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                GPA
              </p>

              <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                Academic
              </span>
            </div>

            <h2 className="text-3xl font-bold text-blue-600">
              {academics?.gpa ?? "-"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {academics?.performanceStatus || "-"}
            </p>

          </div>

          {/* Attendance */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Attendance
              </p>

              <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                Classes
              </span>
            </div>

            <h2 className="text-3xl font-bold text-green-600">
              {attendance?.attendancePercentage ?? 0}%
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {attendance?.presentClasses ?? 0} /{" "}
              {attendance?.totalClasses ?? 0} classes
            </p>

          </div>

          {/* Quiz */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Quiz Average
              </p>

              <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                Quiz
              </span>
            </div>

            <h2 className="text-3xl font-bold text-purple-600">
              {quizzes?.averagePercentage ?? 0}%
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {quizzes?.attempted ?? 0} attempted
            </p>

          </div>

          {/* Assignment */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Assignment Average
              </p>

              <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                Assignment
              </span>
            </div>

            <h2 className="text-3xl font-bold text-orange-600">
              {assignments?.averagePercentage ?? 0}%
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {assignments?.graded ?? 0} graded
            </p>

          </div>

        </div>

        {/* ==================================
            RISK ASSESSMENT
        ================================== */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              Risk Assessment
            </h2>

            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                riskAssessment?.riskLevel === "Low Risk"
                  ? "bg-green-100 text-green-700"
                  : riskAssessment?.riskLevel ===
                      "Medium Risk"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {riskAssessment?.riskLevel || "-"}
            </span>

          </div>

          <div className="mb-5 rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Risk Score
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-800">
              {riskAssessment?.riskScore ?? 0}
            </p>

          </div>

          {riskAssessment?.riskFactors?.length > 0 && (
            <div>

              <p className="mb-2 font-semibold text-gray-700">
                Risk Factors
              </p>

              <ul className="list-disc space-y-1 pl-5 text-gray-600">
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

        {/* ==================================
            COURSE PERFORMANCE
        ================================== */}
        <div
          id="course-performance"
          className="mb-8 scroll-mt-24 rounded-xl bg-white p-6 shadow-sm"
        >

          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Course Performance
          </h2>

          {coursePerformance.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={coursePerformance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="totalMarks"
                  name="Total Marks"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">
              No course performance data available.
            </p>
          )}

        </div>

        {/* ==================================
            ATTENDANCE
        ================================== */}
        <div
          id="attendance"
          className="mb-8 scroll-mt-24 rounded-xl bg-white p-6 shadow-sm"
        >

          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Attendance by Course
          </h2>

          {courseAttendance.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={courseAttendance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="attendancePercentage"
                  name="Attendance %"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">
              No attendance data available.
            </p>
          )}

        </div>

        {/* ==================================
            QUIZ PERFORMANCE
        ================================== */}
        <div
          id="quiz-performance"
          className="mb-8 scroll-mt-24 rounded-xl bg-white p-6 shadow-sm"
        >

          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Quiz Performance
          </h2>

          {quizPerformance.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={quizPerformance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="percentage"
                  name="Quiz Percentage"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">
              No quiz performance data available.
            </p>
          )}

        </div>

        {/* ==================================
            ASSIGNMENT PERFORMANCE
        ================================== */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Assignment Performance
          </h2>

          {assignmentChartData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={assignmentChartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="percentage"
                  name="Assignment Percentage"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">
              No assignment performance data available.
            </p>
          )}

        </div>

        {/* ==================================
            ACADEMIC OVERVIEW
        ================================== */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Academic Overview
          </h2>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">
                Total Subjects
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {academics?.totalSubjects ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <p className="text-sm text-gray-500">
                Quizzes Attempted
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {quizzes?.attempted ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-5">
              <p className="text-sm text-gray-500">
                Assignments Graded
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {assignments?.graded ?? 0}
              </p>
            </div>

          </div>

        </div>

        {/* ==================================
            QUICK ACTIONS
        ================================== */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <button
              onClick={() =>
                scrollToSection("course-performance")
              }
              className="rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View Course Performance
            </button>

            <button
              onClick={() =>
                scrollToSection("attendance")
              }
              className="rounded-lg bg-green-600 p-3 font-semibold text-white transition hover:bg-green-700"
            >
              View Attendance
            </button>

            <button
              onClick={() =>
                scrollToSection("quiz-performance")
              }
              className="rounded-lg bg-purple-600 p-3 font-semibold text-white transition hover:bg-purple-700"
            >
              View Quiz Performance
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default StudentDashboard;