import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import Layout from "../components/Layout";

const API = "http://localhost:5000/api";

// =====================================================
// DEFAULT DATA
// =====================================================

const defaultData = {
  success: true,

  student: {
    studentId: "STU001",
    department: "Computer Science",
    semester: 5,
  },

  academics: {
    totalSubjects: 0,
    gpa: 0,
    performanceStatus: "Loading",
  },

  attendance: {
    totalClasses: 0,
    presentClasses: 0,
    attendancePercentage: 0,
  },

  quizzes: {
    attempted: 0,
    averagePercentage: 0,
  },

  assignments: {
    total: 0,
    graded: 0,
    averagePercentage: 0,
  },

  riskAssessment: {
    riskLevel: "Loading",
    riskScore: 0,
    riskFactors: [],
  },

  insights: {
    strengths: [],
    weaknesses: [],
    recommendations: [],
  },
};

// =====================================================
// API HELPER
// =====================================================

async function getData(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// =====================================================
// STUDENT DASHBOARD
// =====================================================

function StudentDashboard() {
  const [data, setData] = useState(defaultData);

  const [coursePerformance, setCoursePerformance] = useState([]);

  const [courseAttendance, setCourseAttendance] = useState([]);

  const [quizPerformance, setQuizPerformance] = useState([]);

  const [assignmentPerformance, setAssignmentPerformance] =
    useState([]);

  const [error, setError] = useState("");

  // ===================================================
  // LOAD DASHBOARD DATA
  // ===================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    async function loadDashboard() {
      try {
        console.log("FETCHING STUDENT DASHBOARD");

        // =============================================
        // MAIN ANALYTICS
        // =============================================

        const analytics = await getData(
          `${API}/student-analytics/student`,
          token
        );

        console.log("ANALYTICS:", analytics);

        setData(analytics);

        console.log("DASHBOARD DATA SET");

        // =============================================
        // COURSE PERFORMANCE
        // =============================================

        try {
          const result = await getData(
            `${API}/course-performance/student`,
            token
          );

          console.log("COURSE PERFORMANCE:", result);

          setCoursePerformance(
            result.coursePerformance || []
          );
        } catch (error) {
          console.log(
            "Course performance:",
            error.message
          );
        }

        // =============================================
        // COURSE ATTENDANCE
        // =============================================

        try {
          const result = await getData(
            `${API}/course-attendance/student`,
            token
          );

          console.log("COURSE ATTENDANCE:", result);

          setCourseAttendance(
            result.courseAttendance || []
          );
        } catch (error) {
          console.log(
            "Course attendance:",
            error.message
          );
        }

        // =============================================
        // QUIZ PERFORMANCE
        // =============================================

        try {
          const result = await getData(
            `${API}/quiz-performance/student`,
            token
          );

          console.log("QUIZ PERFORMANCE:", result);

          setQuizPerformance(
            result.quizPerformance || []
          );
        } catch (error) {
          console.log(
            "Quiz performance:",
            error.message
          );
        }

        // =============================================
        // ASSIGNMENT PERFORMANCE
        // =============================================

        try {
          const result = await getData(
            `${API}/assignment-performance/student`,
            token
          );

          console.log(
            "ASSIGNMENT PERFORMANCE:",
            result
          );

          setAssignmentPerformance(
            result.assignmentPerformance || []
          );
        } catch (error) {
          console.log(
            "Assignment performance:",
            error.message
          );
        }

        console.log("ALL DASHBOARD DATA LOADED");
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);

        setError(error.message);
      }
    }

    loadDashboard();
  }, []);

  // ===================================================
  // DATA
  // ===================================================

  const student = data.student || {};

  const academics = data.academics || {};

  const attendance = data.attendance || {};

  const quizzes = data.quizzes || {};

  const assignments = data.assignments || {};

  const risk = data.riskAssessment || {};

  const insights = data.insights || {};

  // ===================================================
  // CHART DATA
  // ===================================================

  const performanceChart = coursePerformance.map(
    (item) => ({
      name: item.courseCode || "Course",

      marks: Number(item.totalMarks) || 0,
    })
  );

  const attendanceChart = courseAttendance.map(
    (item) => ({
      name: item.courseCode || "Course",

      percentage:
        Number(item.attendancePercentage) || 0,
    })
  );

  const quizChart = quizPerformance.map(
    (item) => ({
      name:
        item.courseCode ||
        item.quizTitle ||
        "Quiz",

      percentage:
        Number(item.percentage) || 0,
    })
  );

  const attendancePie = [
    {
      name: "Present",

      value:
        Number(attendance.presentClasses) || 0,
    },

    {
      name: "Absent",

      value: Math.max(
        0,

        (Number(attendance.totalClasses) || 0) -
          (Number(attendance.presentClasses) || 0)
      ),
    },
  ];

  // ===================================================
  // DASHBOARD
  // ===================================================

  return (
    <Layout
      role="student"
      title="Student Dashboard"
      description="Your academic performance at a glance"
    >
      <div className="space-y-7">

        {/* =============================================
            ERROR
        ============================================= */}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* =============================================
            WELCOME BANNER
        ============================================= */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl">

          <div className="relative z-10">

            <p className="text-sm font-medium text-blue-100">
              Academic Intelligence Platform
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome back,{" "}
              {student.studentId || "Student"} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Monitor your academic performance,
              attendance, quizzes and assignments
              from one dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <InfoBadge
                label="Department"
                value={
                  student.department ||
                  "Computer Science"
                }
              />

              <InfoBadge
                label="Semester"
                value={
                  student.semester || "-"
                }
              />

            </div>
          </div>

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-white/5" />

        </section>

        {/* =============================================
            STAT CARDS
        ============================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Overall GPA"
            value={academics.gpa ?? 0}
            subtitle={`${academics.totalSubjects || 0} subjects`}
            icon="🎓"
          />

          <StatCard
            title="Attendance"
            value={`${attendance.attendancePercentage ?? 0}%`}
            subtitle={`${attendance.presentClasses || 0} / ${attendance.totalClasses || 0} classes`}
            icon="📅"
          />

          <StatCard
            title="Quiz Average"
            value={`${quizzes.averagePercentage ?? 0}%`}
            subtitle={`${quizzes.attempted || 0} attempted`}
            icon="📝"
          />

          <StatCard
            title="Assignment Average"
            value={`${assignments.averagePercentage ?? 0}%`}
            subtitle={`${assignments.graded || 0} graded`}
            icon="📚"
          />

        </div>

        {/* =============================================
            RISK + ATTENDANCE
        ============================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* RISK */}

          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Academic Risk
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {risk.riskLevel ||
                    "Not Available"}
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
                🛡️
              </div>

            </div>

            <div className="mt-6">

              <div className="mb-2 flex justify-between">

                <span className="text-xs text-slate-500">
                  Risk Score
                </span>

                <span className="text-xs font-bold text-slate-700">
                  {risk.riskScore || 0}/100
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-100">

                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        Number(
                          risk.riskScore
                        ) || 0,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {risk.riskFactors?.length > 0 && (

              <div className="mt-5 space-y-2">

                {risk.riskFactors.map(
                  (factor, index) => (

                    <div
                      key={index}
                      className="rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-700"
                    >
                      {factor}
                    </div>

                  )
                )}

              </div>

            )}

          </section>

          {/* ATTENDANCE */}

          <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm xl:col-span-2">

            <p className="text-sm text-slate-500">
              Attendance Overview
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Attendance Distribution
            </h2>

            <div className="h-[250px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={attendancePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                  >

                    <Cell fill="#4f46e5" />

                    <Cell fill="#ddd6fe" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            <div className="flex justify-center gap-8 text-sm">

              <span className="flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-indigo-600" />

                Present

              </span>

              <span className="flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-violet-200" />

                Absent

              </span>

            </div>

          </section>

        </div>

        {/* =============================================
            COURSE PERFORMANCE
        ============================================= */}

        <ChartCard
          title="Course Performance"
          subtitle="Your marks across subjects"
        >

          {performanceChart.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={performanceChart}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Bar
                  dataKey="marks"
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

            <EmptyChart text="Loading course performance..." />

          )}

        </ChartCard>

        {/* =============================================
            COURSE ATTENDANCE
        ============================================= */}

        <ChartCard
          title="Course-wise Attendance"
          subtitle="Attendance percentage by subject"
        >

          {attendanceChart.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={attendanceChart}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Bar
                  dataKey="percentage"
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

            <EmptyChart text="Loading attendance data..." />

          )}

        </ChartCard>

        {/* =============================================
            QUIZ PERFORMANCE
        ============================================= */}

        <ChartCard
          title="Quiz Performance"
          subtitle="Your quiz scores"
        >

          {quizChart.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart data={quizChart}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <EmptyChart text="Loading quiz performance..." />

          )}

        </ChartCard>

        {/* =============================================
            ASSIGNMENT PERFORMANCE
        ============================================= */}

        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            Assignment Performance
          </h2>

          <p className="mb-5 mt-1 text-sm text-slate-500">
            Your recent assignment results
          </p>

          {assignmentPerformance.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead>

                  <tr className="border-b border-slate-100 text-left">

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Assignment
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Course
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Marks
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {assignmentPerformance.map(
                    (item, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-50"
                      >

                        <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                          {item.assignmentTitle}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-500">
                          {item.courseCode}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-indigo-600">
                          {item.marksObtained} /{" "}
                          {item.totalMarks}
                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                            {item.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyChart text="Loading assignment data..." />

          )}

        </section>

        {/* =============================================
            INSIGHTS
        ============================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <InsightCard
            title="Strengths"
            icon="✨"
            items={insights.strengths || []}
          />

          <InsightCard
            title="Areas to Improve"
            icon="🎯"
            items={insights.weaknesses || []}
          />

          <InsightCard
            title="Recommendations"
            icon="💡"
            items={
              insights.recommendations || []
            }
          />

        </div>

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
}) {
  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

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

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl text-white shadow-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// CHART CARD
// =====================================================

function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-800">
        {title}
      </h2>

      <p className="mb-5 mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

      {children}

    </section>
  );
}

// =====================================================
// EMPTY CHART
// =====================================================

function EmptyChart({ text }) {
  return (
    <div className="flex h-[250px] items-center justify-center">

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
// INSIGHT CARD
// =====================================================

function InsightCard({
  title,
  icon,
  items,
}) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          {icon}
        </div>

        <h2 className="font-bold text-slate-800">
          {title}
        </h2>

      </div>

      {items.length > 0 ? (

        <div className="space-y-3">

          {items.map((item, index) => (

            <div
              key={index}
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              {item}
            </div>

          ))}

        </div>

      ) : (

        <p className="text-sm text-slate-400">
          No information available.
        </p>

      )}

    </section>
  );
}

// =====================================================
// VERY IMPORTANT
// =====================================================

export default StudentDashboard;