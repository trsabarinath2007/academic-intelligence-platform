import React, { useEffect, useState } from "react";

const ANALYTICS_URL =
  "http://localhost:5000/api/admin-analytics/overall-performance";

const AI_URL =
  "http://localhost:5000/api/academic-intelligence/faculty/ai-insights";

function FacultyAIInsights() {
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loadingAnalytics, setLoadingAnalytics] =
    useState(true);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        ANALYTICS_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load faculty analytics"
        );
      }

      setAnalytics(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      setLoadingAI(true);
      setError("");

      const response = await fetch(
        AI_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            analytics,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to generate AI insights"
        );
      }

      setInsights(data.insights);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loadingAnalytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          <p className="mt-4 text-gray-600">
            Loading faculty analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8">
          <p className="text-red-600">
            {error ||
              "Unable to load faculty analytics."}
          </p>
        </div>
      </div>
    );
  }

  const summary =
    analytics.summary || {};

  const atRiskStudents =
    analytics.atRiskStudents || [];

  const departmentAnalytics =
    analytics.departmentAnalytics || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <main className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            AI Faculty Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Class Performance Insights
          </h1>

          <p className="mt-2 text-gray-500">
            Analyze class-level academic patterns using
            Ollama and Gemma 3 4B.
          </p>

          <button
            type="button"
            onClick={generateAIInsights}
            disabled={loadingAI}
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loadingAI
              ? "Generating AI Insights..."
              : "Generate AI Insights"}
          </button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Students"
            value={summary.totalStudents || 0}
          />

          <MetricCard
            title="Average GPA"
            value={summary.averageGPA || 0}
          />

          <MetricCard
            title="Average Attendance"
            value={`${summary.averageAttendance || 0}%`}
          />

          <MetricCard
            title="Average Quiz Score"
            value={`${summary.averageQuizScore || 0}%`}
          />
        </div>

        {/* Existing At-Risk Data */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Current At-Risk Students
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Students identified by the existing analytics engine.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <MetricCard
              title="At-Risk Students"
              value={summary.atRiskStudents || 0}
            />

            <MetricCard
              title="Need Improvement"
              value={
                summary.studentsNeedingImprovement ||
                0
              }
            />

            <MetricCard
              title="High Performers"
              value={summary.highPerformers || 0}
            />
          </div>

          {atRiskStudents.length > 0 && (
            <div className="mt-5 space-y-3">
              {atRiskStudents.map(
                (student, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-red-50 p-4"
                  >
                    <p className="font-semibold text-gray-800">
                      {student.studentId}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      GPA: {student.gpa} · Attendance:{" "}
                      {student.attendancePercentage}% ·
                      Quiz: {student.quizAverage}%
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Department Data */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Department Performance
          </h2>

          <div className="mt-4 space-y-3">
            {departmentAnalytics.map(
              (department, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <span className="font-medium text-gray-700">
                    {department.department}
                  </span>

                  <span className="font-bold text-purple-600">
                    {department.averageGPA}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* AI Insights */}
        {insights && (
          <>
            <AISection
              title="AI Class Performance Summary"
              items={[insights.summary]}
            />

            <AISection
              title="Key Academic Concerns"
              items={insights.keyConcerns}
            />

            <AISection
              title="Weak Areas"
              items={insights.weakAreas}
            />

            <AISection
              title="Suggested Faculty Actions"
              items={insights.suggestedFacultyActions}
            />

            <AISection
              title="Teaching Improvement Recommendations"
              items={
                insights.teachingImprovementRecommendations
              }
            />

            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
              Generated by{" "}
              <span className="font-semibold">
                {insights.model || "gemma3:4b"}
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const MetricCard = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
};

const AISection = ({
  title,
  items,
}) => {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>

      <div className="mt-4 space-y-3">
        {safeItems.length > 0 ? (
          safeItems.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700"
              >
                <span className="mr-2 font-semibold text-purple-600">
                  {index + 1}.
                </span>

                {item}
              </div>
            )
          )
        ) : (
          <p className="text-sm text-gray-500">
            No information available.
          </p>
        )}
      </div>
    </section>
  );
};

export default FacultyAIInsights;