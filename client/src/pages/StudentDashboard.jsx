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

function StudentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState([]);
  const [assignmentPerformance, setAssignmentPerformance] = useState([]);

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
          coursePerformanceResponse,
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

        const analyticsData =
          await analyticsResponse.json();

        const coursePerformanceData =
          await coursePerformanceResponse.json();

        const attendanceData =
          await attendanceResponse.json();

        const quizData =
          await quizResponse.json();

        const assignmentData =
          await assignmentResponse.json();

        if (!analyticsResponse.ok) {
          throw new Error(
            analyticsData.message ||
              "Failed to fetch analytics"
          );
        }

        if (!coursePerformanceResponse.ok) {
          throw new Error(
            coursePerformanceData.message ||
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
          coursePerformanceData.coursePerformance || []
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">

          <h1 className="mb-3 text-xl font-bold text-red-600">
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

  // Data
  const student = analytics?.student;
  const academics = analytics?.academics;
  const attendance = analytics?.attendance;
  const quizzes = analytics?.quizzes;
  const assignments = analytics?.assignments;
  const riskAssessment = analytics?.riskAssessment;

  // Assignment chart data
  const assignmentChartData =
    assignmentPerformance.map((assignment) => ({
      name: assignment.assignmentTitle,

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

      {/* ================= NAVBAR ================= */}

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

          {/* Right Side */}

          <div className="flex items-center gap-4">

            {/* Profile */}

            <button
              onClick={() => {
                window.location.href =
                  "/student-profile";
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-gray-100"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {student?.studentId
                  ? student.studentId.charAt(0)
                  : "S"}
              </div>

              <div className="hidden text-left sm:block">

                <p className="text-sm font-semibold text-gray-800">
                  {student?.studentId}
                </p>

                <p className="text-xs text-gray-500">
                  {student?.department}
                </p>

              </div>

            </button>

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Monitor your academic performance and progress.
          </p>

        </div>

        {/* ================= STUDENT INFO ================= */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Student ID
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.studentId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Semester
              </p>

              <p className="mt-1 text-lg font-bold text-gray-800">
                {student?.semester}
              </p>
            </div>

          </div>

        </div>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* GPA */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              GPA
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {academics?.gpa}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {academics?.totalSubjects} Subjects
            </p>

          </div>

          {/* Attendance */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {attendance?.attendancePercentage}%
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {attendance?.presentClasses}/
              {attendance?.totalClasses} Classes
            </p>

          </div>

          {/* Quiz */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Quiz Average
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {quizzes?.averagePercentage}%
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {quizzes?.attempted} Attempted
            </p>

          </div>

          {/* Assignment */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Assignment Average
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {assignments?.averagePercentage}%
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {assignments?.graded} Graded
            </p>

          </div>

        </div>

        {/* ================= RISK ASSESSMENT ================= */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Risk Assessment
          </h2>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Current Risk Level
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {riskAssessment?.riskLevel}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Risk Score
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {riskAssessment?.riskScore}
              </p>

            </div>

          </div>

          {riskAssessment?.riskFactors?.length > 0 && (
            <div className="mt-5">

              <p className="mb-2 text-sm font-semibold text-gray-700">
                Risk Factors
              </p>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">

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

        {/* ================= COURSE PERFORMANCE ================= */}

        <section
          id="course-performance"
          className="mb-8 rounded-xl bg-white p-6 shadow-sm"
        >

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Course Performance
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Total marks obtained in each course.
          </p>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={coursePerformance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="totalMarks"
                  fill="#2563eb"
                  name="Total Marks"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* ================= ATTENDANCE ================= */}

        <section
          id="attendance"
          className="mb-8 rounded-xl bg-white p-6 shadow-sm"
        >

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Course-wise Attendance
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Attendance percentage for each course.
          </p>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={courseAttendance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="courseCode" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Bar
                  dataKey="attendancePercentage"
                  fill="#16a34a"
                  name="Attendance %"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* ================= QUIZ PERFORMANCE ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Quiz Performance
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Performance in completed quizzes.
          </p>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={quizPerformance}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="quizTitle"
                  tick={{ fontSize: 12 }}
                />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Bar
                  dataKey="percentage"
                  fill="#9333ea"
                  name="Percentage"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* ================= ASSIGNMENT PERFORMANCE ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Assignment Performance
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Percentage obtained in assignments.
          </p>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={assignmentChartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Bar
                  dataKey="percentage"
                  fill="#f97316"
                  name="Percentage"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* ================= ACADEMIC OVERVIEW ================= */}

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-gray-800">
            Academic Overview
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Academic Status
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {academics?.performanceStatus}
              </p>

            </div>

            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Quiz Performance
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {quizzes?.averagePercentage}%
              </p>

            </div>

            <div className="rounded-lg bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Assignment Performance
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {assignments?.averagePercentage}%
              </p>

            </div>

          </div>

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mb-8">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* My Profile */}

            <button
              onClick={() => {
                window.location.href =
                  "/student-profile";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                My Profile
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View your student profile and personal details.
              </p>

            </button>

            {/* My Courses */}

            <button
              onClick={() => {
                window.location.href =
                  "/student-courses";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                My Courses
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View your current semester courses.
              </p>

            </button>

            {/* Academic Records */}

            <button
              onClick={() => {
                window.location.href =
                  "/academic-records";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Academic Records
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View marks, grades and academic records.
              </p>

            </button>

            {/* Attendance */}

            <button
              onClick={() => {
                window.location.href =
                  "/attendance";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Attendance
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Check your course-wise attendance.
              </p>

            </button>

            {/* Quiz Performance */}

            <button
              onClick={() => {
                window.location.href =
                  "/quiz-performance";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Quiz Performance
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View your quiz scores and performance.
              </p>

            </button>

            {/* Assignment Performance */}

            <button
              onClick={() => {
                window.location.href =
                  "/assignment-performance";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Assignment Performance
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View assignment scores and faculty feedback.
              </p>

            </button>

            {/* Performance Insights */}

            <button
              onClick={() => {
                window.location.href =
                  "/performance-insights";
              }}
              className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-lg font-bold text-gray-800">
                Performance Insights
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View your strengths, weaknesses and recommendations.
              </p>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;