import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

function FacultyStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [quizSummary, setQuizSummary] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [assignmentSummary, setAssignmentSummary] = useState(null);

  const [risk, setRisk] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [performanceLoading, setPerformanceLoading] =
    useState(true);
  const [attendanceLoading, setAttendanceLoading] =
    useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] =
    useState(true);
  const [riskLoading, setRiskLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
    fetchPerformance();
    fetchAttendance();
    fetchQuizPerformance();
    fetchAssignmentPerformance();
    fetchRisk();
    fetchInsights();
  }, [id]);

  const getToken = () => localStorage.getItem("token");

  // ==========================================
  // STUDENT
  // ==========================================

  const fetchStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch student"
        );
      }

      setStudent(data.student);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACADEMIC PERFORMANCE
  // ==========================================

  const fetchPerformance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}/academic-performance`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch academic performance"
        );
      }

      setPerformance(data.performance || []);
    } catch (error) {
      console.error(error);
    } finally {
      setPerformanceLoading(false);
    }
  };

  // ==========================================
  // ATTENDANCE
  // ==========================================

  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}/attendance`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch attendance"
        );
      }

      setAttendance(data.attendance || []);
      setAttendanceSummary(data.summary || null);
    } catch (error) {
      console.error(error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // ==========================================
  // QUIZ PERFORMANCE
  // ==========================================

  const fetchQuizPerformance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}/quiz-performance`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch quiz performance"
        );
      }

      setQuizzes(data.quizzes || []);
      setQuizSummary(data.summary || null);
    } catch (error) {
      console.error(error);
    } finally {
      setQuizLoading(false);
    }
  };

  // ==========================================
  // ASSIGNMENT PERFORMANCE
  // ==========================================

  const fetchAssignmentPerformance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}/assignment-performance`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch assignment performance"
        );
      }

      setAssignments(data.assignments || []);
      setAssignmentSummary(data.summary || null);
    } catch (error) {
      console.error(error);
    } finally {
      setAssignmentLoading(false);
    }
  };

  // ==========================================
  // RISK ASSESSMENT
  // ==========================================

  const fetchRisk = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/risk/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch risk assessment"
        );
      }

      setRisk(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRiskLoading(false);
    }
  };

  // ==========================================
  // PERFORMANCE INSIGHTS
  // ==========================================

  const fetchInsights = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/insights/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch performance insights"
        );
      }

      setInsights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setInsightsLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Layout
        role="faculty"
        title="Student Details"
        description="View student information and performance"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">
            Loading student details...
          </p>
        </div>
      </Layout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !student) {
    return (
      <Layout
        role="faculty"
        title="Student Details"
        description="View student information"
      >
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-red-600">
          {error || "Student not found"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      role="faculty"
      title="Student Details"
      description="View student information and academic performance"
    >
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate("/faculty-students")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#4f46e5] hover:underline"
      >
        ← Back to Students
      </button>

      {/* ==========================================
          STUDENT PROFILE
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-600">
              Student Profile
            </p>

            <h1 className="text-2xl font-bold text-[#172033]">
              {student.user?.name || "Student"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {student.user?.email ||
                "No email available"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoBox
              label="Student ID"
              value={student.studentId}
            />

            <InfoBox
              label="Department"
              value={student.department}
            />

            <InfoBox
              label="Semester"
              value={student.semester}
            />

            <InfoBox
              label="Section"
              value={student.section}
            />
          </div>
        </div>
      </div>

      {/* ==========================================
          ATTENDANCE SUMMARY
      ========================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Classes"
          value={
            attendanceSummary?.totalClasses ?? 0
          }
        />

        <SummaryCard
          title="Present"
          value={
            attendanceSummary?.presentClasses ?? 0
          }
        />

        <SummaryCard
          title="Absent"
          value={
            attendanceSummary?.absentClasses ?? 0
          }
        />

        <SummaryCard
          title="Attendance"
          value={`${
            attendanceSummary?.attendancePercentage ?? 0
          }%`}
          highlight
        />
      </div>

      {/* ==========================================
          QUIZ + ASSIGNMENT SUMMARY
      ========================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Quizzes Attempted"
          value={
            quizSummary?.quizzesAttempted ?? 0
          }
        />

        <SummaryCard
          title="Average Quiz Score"
          value={`${
            quizSummary?.averagePercentage ?? 0
          }%`}
          highlight
        />

        <SummaryCard
          title="Assignments Graded"
          value={
            assignmentSummary?.assignmentsGraded ?? 0
          }
        />

        <SummaryCard
          title="Average Assignment"
          value={`${
            assignmentSummary?.averagePercentage ?? 0
          }%`}
          highlight
        />
      </div>

      {/* ==========================================
          RISK ASSESSMENT
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#172033]">
            Risk Assessment
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Academic risk indicators for this student
          </p>
        </div>

        {riskLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading risk assessment...
          </div>
        ) : !risk ? (
          <div className="py-8 text-center text-gray-500">
            Risk assessment unavailable.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Risk Level */}

            <div className="rounded-xl bg-[#f8f7ff] p-5">
              <p className="text-sm text-gray-500">
                Risk Level
              </p>

              <div className="mt-3">
                <RiskBadge
                  riskLevel={
                    risk.riskAssessment?.riskLevel
                  }
                />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Risk Score
              </p>

              <p className="mt-1 text-3xl font-bold text-[#172033]">
                {risk.riskAssessment?.riskScore ?? 0}
                <span className="text-base font-medium text-gray-400">
                  {" "}
                  / 100
                </span>
              </p>
            </div>

            {/* Performance */}

            <div className="rounded-xl bg-[#f8f7ff] p-5">
              <p className="mb-4 text-sm font-semibold text-[#172033]">
                Performance Indicators
              </p>

              <div className="space-y-4">
                <MetricRow
                  label="GPA"
                  value={risk.performance?.gpa ?? 0}
                />

                <MetricRow
                  label="Attendance"
                  value={`${
                    risk.performance
                      ?.attendancePercentage ?? 0
                  }%`}
                />

                <MetricRow
                  label="Quiz Average"
                  value={`${
                    risk.performance?.quizAverage ?? 0
                  }%`}
                />

                <MetricRow
                  label="Low-Mark Subjects"
                  value={
                    risk.performance?.lowMarkSubjects ?? 0
                  }
                />
              </div>
            </div>

            {/* Risk Factors */}

            <div className="rounded-xl bg-[#f8f7ff] p-5">
              <p className="mb-4 text-sm font-semibold text-[#172033]">
                Risk Factors
              </p>

              {risk.riskAssessment?.riskFactors
                ?.length > 0 ? (
                <div className="space-y-3">
                  {risk.riskAssessment.riskFactors.map(
                    (factor, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg bg-white p-3"
                      >
                        <span className="mt-0.5 text-red-500">
                          •
                        </span>

                        <p className="text-sm text-gray-600">
                          {factor}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No significant risk factors identified.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          ACADEMIC PERFORMANCE
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Academic Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Subject-wise academic performance
          </p>
        </div>

        {performanceLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading academic performance...
          </div>
        ) : performance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No academic records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf9ff] text-left">
                  <TableHead text="Course" />
                  <TableHead text="Credits" />
                  <TableHead text="Internal" />
                  <TableHead text="External" />
                  <TableHead text="Total" />
                  <TableHead text="Grade" />
                </tr>
              </thead>

              <tbody>
                {performance.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-[#faf9ff]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#172033]">
                        {item.courseCode}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.courseName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.credits}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.internalMarks}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.externalMarks}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#172033]">
                        {item.totalMarks}
                      </span>

                      <span className="text-gray-400">
                        {" "}
                        / 100
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <GradeBadge
                        grade={item.grade}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          ATTENDANCE DETAILS
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Attendance Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Course-wise attendance records
          </p>
        </div>

        {attendanceLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading attendance...
          </div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf9ff] text-left">
                  <TableHead text="Course" />
                  <TableHead text="Date" />
                  <TableHead text="Status" />
                </tr>
              </thead>

              <tbody>
                {attendance.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-[#faf9ff]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#172033]">
                        {item.courseCode}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.courseName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.date
                        ? new Date(
                            item.date
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "Present"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          QUIZ PERFORMANCE
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Quiz Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Student's quiz scores and performance
          </p>
        </div>

        {quizLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading quiz performance...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No quiz attempts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf9ff] text-left">
                  <TableHead text="Quiz" />
                  <TableHead text="Course" />
                  <TableHead text="Score" />
                  <TableHead text="Percentage" />
                  <TableHead text="Attempted" />
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-[#faf9ff]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#172033]">
                        {quiz.quizTitle}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-[#172033]">
                        {quiz.courseCode}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {quiz.courseName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#172033]">
                      {quiz.score} /{" "}
                      {quiz.totalMarks}
                    </td>

                    <td className="px-6 py-4">
                      <PercentageBadge
                        percentage={quiz.percentage}
                      />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quiz.attemptedAt
                        ? new Date(
                            quiz.attemptedAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          ASSIGNMENT PERFORMANCE
      ========================================== */}

      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Assignment Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Student's assignment submissions and grades
          </p>
        </div>

        {assignmentLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading assignment performance...
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No assignment submissions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf9ff] text-left">
                  <TableHead text="Assignment" />
                  <TableHead text="Course" />
                  <TableHead text="Score" />
                  <TableHead text="Percentage" />
                  <TableHead text="Status" />
                  <TableHead text="Feedback" />
                </tr>
              </thead>

              <tbody>
                {assignments.map(
                  (assignment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-[#faf9ff]"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#172033]">
                          {assignment.assignmentTitle}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-[#172033]">
                          {assignment.courseCode}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {assignment.courseName}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#172033]">
                        {assignment.marksObtained ??
                          "-"}{" "}
                        /{" "}
                        {assignment.totalMarks ??
                          "-"}
                      </td>

                      <td className="px-6 py-4">
                        <PercentageBadge
                          percentage={
                            assignment.percentage
                          }
                        />
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            assignment.status ===
                            "Graded"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {assignment.status ||
                            "Pending"}
                        </span>
                      </td>

                      <td className="max-w-[280px] px-6 py-4 text-sm text-gray-600">
                        {assignment.feedback ||
                          "No feedback"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          PERFORMANCE INSIGHTS
      ========================================== */}

      <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Performance Insights
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Strengths, areas requiring attention and recommendations
          </p>
        </div>

        {insightsLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading performance insights...
          </div>
        ) : !insights ? (
          <div className="py-8 text-center text-gray-500">
            Performance insights unavailable.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Strengths */}

            <InsightCard
              title="Strengths"
              items={
                insights.insights?.strengths || []
              }
              emptyMessage="No strengths recorded."
              type="strength"
            />

            {/* Weaknesses */}

            <InsightCard
              title="Areas to Improve"
              items={
                insights.insights?.weaknesses || []
              }
              emptyMessage="No major weaknesses recorded."
              type="weakness"
            />

            {/* Recommendations */}

            <InsightCard
              title="Recommendations"
              items={
                insights.insights?.recommendations ||
                []
              }
              emptyMessage="No recommendations available."
              type="recommendation"
            />
          </div>
        )}

        {/* Insight Summary */}

        {!insightsLoading &&
          insights?.insights?.summary && (
            <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <MiniStat
                label="Academic Records"
                value={
                  insights.insights.summary
                    .academicRecords
                }
              />

              <MiniStat
                label="Attendance"
                value={`${
                  insights.insights.summary
                    .attendancePercentage ?? 0
                }%`}
              />

              <MiniStat
                label="Quizzes"
                value={
                  insights.insights.summary
                    .quizzesAttempted
                }
              />

              <MiniStat
                label="Assignments"
                value={
                  insights.insights.summary
                    .assignmentsSubmitted
                }
              />
            </div>
          )}
      </div>
    </Layout>
  );
}

/* ==========================================
   REUSABLE COMPONENTS
========================================== */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f8f7ff] px-4 py-3">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#172033]">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          highlight
            ? "text-[#5b4ee8]"
            : "text-[#172033]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableHead({ text }) {
  return (
    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
      {text}
    </th>
  );
}

function GradeBadge({ grade }) {
  let className =
    "bg-violet-50 text-violet-700";

  if (grade === "A") {
    className =
      "bg-green-50 text-green-700";
  } else if (grade === "B+") {
    className =
      "bg-blue-50 text-blue-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {grade}
    </span>
  );
}

function PercentageBadge({ percentage }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        percentage >= 80
          ? "bg-green-50 text-green-700"
          : percentage >= 60
          ? "bg-blue-50 text-blue-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {percentage ?? 0}%
    </span>
  );
}

function RiskBadge({ riskLevel }) {
  let className =
    "bg-green-50 text-green-700";

  if (riskLevel === "Moderate Risk") {
    className =
      "bg-yellow-50 text-yellow-700";
  } else if (riskLevel === "High Risk") {
    className =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${className}`}
    >
      {riskLevel || "Unknown"}
    </span>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-[#172033]">
        {value}
      </span>
    </div>
  );
}

function InsightCard({
  title,
  items,
  emptyMessage,
  type,
}) {
  const styles = {
    strength: {
      container: "bg-green-50",
      dot: "bg-green-500",
      title: "text-green-800",
    },

    weakness: {
      container: "bg-orange-50",
      dot: "bg-orange-500",
      title: "text-orange-800",
    },

    recommendation: {
      container: "bg-violet-50",
      dot: "bg-violet-500",
      title: "text-violet-800",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-xl p-5 ${style.container}`}
    >
      <h3
        className={`mb-4 font-semibold ${style.title}`}
      >
        {title}
      </h3>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
              />

              <p className="text-sm leading-6 text-gray-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f8f7ff] p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-[#172033]">
        {value}
      </p>
    </div>
  );
}

export default FacultyStudentDetails;