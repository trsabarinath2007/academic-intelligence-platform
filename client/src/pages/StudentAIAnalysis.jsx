import React, { useEffect, useState } from "react";

const StudentAIAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        "http://localhost:5000/api/academic-intelligence/student/ai-analysis",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to generate AI analysis"
        );
      }

      setData(result);
    } catch (err) {
      console.error("AI analysis error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>

          <p className="mt-4 text-gray-600">
            Gemini is analyzing your academic performance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <div className="rounded-xl bg-red-50 p-5">
            <h2 className="text-lg font-semibold text-red-700">
              Unable to generate AI analysis
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                fetchAnalysis();
              }}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const intelligence = data?.intelligence || {};
  const aiAnalysis = data?.aiAnalysis || {};

  const riskLevel =
    intelligence.riskLevel || "Unknown";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            AI Academic Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            AI Performance Analysis
          </h1>

          <p className="mt-2 text-gray-500">
            Gemini has analyzed your academic activity
            and generated personalized insights.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Attendance"
            value={`${metrics.attendancePercentage ?? 0}%`}
          />

          <MetricCard
            title="Assignments"
            value={`${metrics.assignmentAveragePercentage ?? 0}%`}
          />

          <MetricCard
            title="Quiz Average"
            value={`${metrics.quizAveragePercentage ?? 0}%`}
          />

          <MetricCard
            title="Material Completion"
            value={`${metrics.materialCompletionPercentage ?? 0}%`}
          />

          <MetricCard
            title="Engagement"
            value={`${intelligence.engagementScore ?? 0}`}
          />
        </div>

        {/* Health / Risk */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Academic Health
            </h2>

            <div className="mt-6 flex items-center justify-center">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-green-200">
                <span className="text-4xl font-bold text-gray-800">
                  {intelligence.academicHealthScore ?? 0}
                </span>

                <span className="text-sm text-gray-500">
                  / 100
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Academic Risk
            </h2>

            <div className="mt-6">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getRiskClass(
                  riskLevel
                )}`}
              >
                {riskLevel} Risk
              </span>

              <p className="mt-4 text-gray-600">
                Risk Score:{" "}
                <span className="font-semibold">
                  {intelligence.riskScore ?? 0}
                </span>
              </p>
            </div>

            {intelligence.riskFactors &&
              intelligence.riskFactors.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800">
                    Risk Factors
                  </h3>

                  <div className="mt-3 space-y-2">
                    {intelligence.riskFactors.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* AI Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Gemini AI Summary
              </h2>

              <p className="text-sm text-gray-500">
                Personalized interpretation of your academic data
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-5 leading-7 text-gray-700">
            {aiAnalysis.summary ||
              "No AI summary available."}
          </div>
        </div>

        {/* Strengths and Concerns */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AnalysisList
            title="Strengths"
            items={aiAnalysis.strengths}
            emptyText="No strengths identified."
          />

          <AnalysisList
            title="Concerns"
            items={aiAnalysis.concerns}
            emptyText="No major concerns identified."
          />
        </div>

        {/* Weak Areas */}
        <AnalysisList
          title="Weak Areas"
          items={aiAnalysis.weakAreas}
          emptyText="No weak areas identified."
        />

        {/* Recommendations */}
        <AnalysisList
          title="Personalized Recommendations"
          items={aiAnalysis.recommendations}
          emptyText="No recommendations available."
        />

        {/* Priority Actions */}
        <AnalysisList
          title="Priority Actions"
          items={aiAnalysis.priorityActions}
          emptyText="No priority actions available."
        />

        {/* Backend Recommendations */}
        {intelligence.recommendations &&
          intelligence.recommendations.length > 0 && (
            <AnalysisList
              title="Academic Intelligence Recommendations"
              items={intelligence.recommendations}
              emptyText=""
            />
          )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => {
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

const AnalysisList = ({
  title,
  items,
  emptyText,
}) => {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        {title}
      </h2>

      {safeItems.length > 0 ? (
        <div className="mt-4 space-y-3">
          {safeItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700"
            >
              <span className="mr-2 font-semibold text-green-600">
                {index + 1}.
              </span>

              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          {emptyText}
        </p>
      )}
    </div>
  );
};

export default StudentAIAnalysis;