import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Eye,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import { apiRequest } from "../api";

export default function FacultySubmissions() {
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [marksObtained, setMarksObtained] =
    useState("");

  const [feedback, setFeedback] = useState("");

  // ==========================================
  // FETCH SUBMISSIONS
  // ==========================================

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        "/submissions",
        {
          method: "GET",
        }
      );

      setSubmissions(
        response.submissions || []
      );
    } catch (error) {
      console.error(
        "Fetch submissions error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status) => {
    if (status === "Graded") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={14} />
          Graded
        </span>
      );
    }

    if (status === "Late") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          <Clock size={14} />
          Late
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <AlertCircle size={14} />
        Submitted
      </span>
    );
  };

  // ==========================================
  // OPEN SUBMISSION
  // ==========================================

  const openSubmission = (submission) => {
    setError("");
    setSuccess("");

    setSelectedSubmission(submission);

    setMarksObtained(
      submission.marksObtained !== undefined &&
        submission.marksObtained !== null
        ? submission.marksObtained
        : ""
    );

    setFeedback(
      submission.feedback || ""
    );
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeSubmission = () => {
    if (grading) {
      return;
    }

    setSelectedSubmission(null);
    setMarksObtained("");
    setFeedback("");
  };

  // ==========================================
  // GRADE SUBMISSION
  // ==========================================

  const handleGrade = async (event) => {
    event.preventDefault();

    if (!selectedSubmission) {
      return;
    }

    setError("");
    setSuccess("");

    const totalMarks =
      selectedSubmission.assignment
        ?.totalMarks;

    const marks = Number(marksObtained);

    if (
      marksObtained === "" ||
      Number.isNaN(marks)
    ) {
      setError(
        "Please enter marks obtained."
      );
      return;
    }

    if (marks < 0 || marks > totalMarks) {
      setError(
        `Marks must be between 0 and ${totalMarks}.`
      );
      return;
    }

    try {
      setGrading(true);

      const response = await apiRequest(
        `/submissions/${selectedSubmission._id}/grade`,
        {
          method: "PUT",
          body: {
            marksObtained: marks,
            feedback: feedback.trim(),
          },
        }
      );

      setSuccess(
        response.message ||
          "Assignment graded successfully"
      );

      setSelectedSubmission(null);
      setMarksObtained("");
      setFeedback("");

      await fetchSubmissions();
    } catch (error) {
      console.error(
        "Grade submission error:",
        error
      );

      setError(
        error.message ||
          "Failed to grade submission"
      );
    } finally {
      setGrading(false);
    }
  };

  // ==========================================
  // CALCULATE PERCENTAGE
  // ==========================================

  const getPercentage = (submission) => {
    const marks =
      submission.marksObtained;

    const total =
      submission.assignment?.totalMarks;

    if (
      marks === undefined ||
      marks === null ||
      !total
    ) {
      return null;
    }

    return Math.round(
      (marks / total) * 100
    );
  };

  const gradedCount =
    submissions.filter(
      (submission) =>
        submission.status === "Graded"
    ).length;

  const pendingCount =
    submissions.filter(
      (submission) =>
        submission.status !== "Graded"
    ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <ClipboardCheck
              size={26}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Submissions
            </h1>

            <p className="mt-1 text-slate-500">
              Review, grade and provide feedback
              on student assignments.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================
          SUCCESS
      ====================================== */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Submissions
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {submissions.length}
              </p>
            </div>

            <ClipboardCheck
              size={30}
              className="text-blue-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending Grading
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {pendingCount}
              </p>
            </div>

            <Clock
              size={30}
              className="text-orange-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Graded
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {gradedCount}
              </p>
            </div>

            <CheckCircle
              size={30}
              className="text-green-500"
            />
          </div>
        </div>
      </div>

      {/* ======================================
          SUBMISSIONS TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            All Student Submissions
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={32}
              className="animate-spin text-blue-600"
            />
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardCheck
              size={48}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-700">
              No submissions yet
            </h3>

            <p className="mt-1 text-slate-500">
              Student submissions will appear
              here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Assignment
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Marks
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {submissions.map(
                  (submission) => {
                    const percentage =
                      getPercentage(
                        submission
                      );

                    return (
                      <tr
                        key={submission._id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        {/* STUDENT */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                              <GraduationCap
                                size={18}
                                className="text-blue-600"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {
                                  submission
                                    .student
                                    ?.user
                                    ?.name
                                }
                              </p>

                              <p className="text-xs text-slate-500">
                                {
                                  submission
                                    .student
                                    ?.studentId
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ASSIGNMENT */}

                        <td className="px-6 py-4">
                          <p className="max-w-xs font-semibold text-slate-800">
                            {
                              submission
                                .assignment
                                ?.title
                            }
                          </p>
                        </td>

                        {/* COURSE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={16}
                              className="text-blue-500"
                            />

                            <span className="font-medium text-slate-700">
                              {
                                submission
                                  .assignment
                                  ?.course
                                  ?.courseCode
                              }
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(
                            submission.submittedAt ||
                              submission.createdAt
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          {getStatusBadge(
                            submission.status
                          )}
                        </td>

                        {/* MARKS */}

                        <td className="px-6 py-4">
                          {submission.status ===
                            "Graded" ? (
                            <div>
                              <p className="font-bold text-slate-800">
                                {
                                  submission.marksObtained
                                }{" "}
                                /{" "}
                                {
                                  submission
                                    .assignment
                                    ?.totalMarks
                                }
                              </p>

                              <p className="text-xs text-slate-500">
                                {percentage}%
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openSubmission(
                                submission
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <Eye size={16} />
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================
          REVIEW / GRADE MODAL
      ====================================== */}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Review Submission
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    selectedSubmission
                      .assignment?.title
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={closeSubmission}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleGrade}
              className="space-y-5 p-6"
            >
              {/* STUDENT INFO */}

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <GraduationCap
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-blue-900">
                      {
                        selectedSubmission
                          .student?.user
                          ?.name
                      }
                    </p>

                    <p className="text-sm text-blue-700">
                      Student ID:{" "}
                      {
                        selectedSubmission
                          .student
                          ?.studentId
                      }
                    </p>

                    <p className="text-sm text-blue-700">
                      {
                        selectedSubmission
                          .student?.department
                      }{" "}
                      • Semester{" "}
                      {
                        selectedSubmission
                          .student?.semester
                      }{" "}
                      • Section{" "}
                      {
                        selectedSubmission
                          .student?.section
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* ASSIGNMENT INFO */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Course
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      selectedSubmission
                        .assignment
                        ?.course
                        ?.courseCode
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Due Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(
                      selectedSubmission
                        .assignment
                        ?.dueDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Maximum Marks
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      selectedSubmission
                        .assignment
                        ?.totalMarks
                    }
                  </p>
                </div>
              </div>

              {/* SUBMISSION */}

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Student Submission
                </p>

                <div className="min-h-[180px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {
                    selectedSubmission.submissionText
                  }
                </div>
              </div>

              {/* CURRENT STATUS */}

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <div className="mt-1">
                    {getStatusBadge(
                      selectedSubmission.status
                    )}
                  </div>
                </div>

                {selectedSubmission.status ===
                  "Graded" && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Current Score
                    </p>

                    <p className="text-xl font-bold text-green-600">
                      {
                        selectedSubmission.marksObtained
                      }{" "}
                      /{" "}
                      {
                        selectedSubmission
                          .assignment
                          ?.totalMarks
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* MARKS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Marks Obtained *
                </label>

                <input
                  type="number"
                  min="0"
                  max={
                    selectedSubmission
                      .assignment
                      ?.totalMarks
                  }
                  value={marksObtained}
                  onChange={(event) =>
                    setMarksObtained(
                      event.target.value
                    )
                  }
                  placeholder={`Enter marks out of ${
                    selectedSubmission
                      .assignment?.totalMarks
                  }`}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* FEEDBACK */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Faculty Feedback
                </label>

                <textarea
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Enter feedback for the student..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeSubmission}
                  disabled={grading}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={grading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {grading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {selectedSubmission.status ===
                      "Graded"
                        ? "Update Grade"
                        : "Grade Submission"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}