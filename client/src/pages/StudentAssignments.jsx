import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Calendar,
  BookOpen,
  Send,
  Eye,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { apiRequest } from "../api";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [submissionText, setSubmissionText] =
    useState("");

  const [viewSubmission, setViewSubmission] =
    useState(null);

  // ==========================================
  // FETCH ASSIGNMENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      const response = await apiRequest(
        "/assignments",
        {
          method: "GET",
        }
      );

      setAssignments(response.assignments || []);
    } catch (error) {
      console.error(
        "Fetch assignments error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch assignments"
      );
    }
  };

  // ==========================================
  // FETCH MY SUBMISSIONS
  // ==========================================

  const fetchSubmissions = async () => {
    try {
      const response = await apiRequest(
        "/submissions/my-submissions",
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
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchAssignments(),
          fetchSubmissions(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================================
  // SUBMISSION MAP
  // ==========================================

  const submissionMap = useMemo(() => {
    const map = {};

    submissions.forEach((submission) => {
      const assignmentId =
        submission.assignment?._id ||
        submission.assignment;

      if (assignmentId) {
        map[assignmentId] = submission;
      }
    });

    return map;
  }, [submissions]);

  // ==========================================
  // OPEN SUBMISSION FORM
  // ==========================================

  const openSubmissionForm = (assignment) => {
    setError("");
    setSuccess("");

    setSelectedAssignment(assignment);
    setSubmissionText("");
  };

  // ==========================================
  // CLOSE SUBMISSION FORM
  // ==========================================

  const closeSubmissionForm = () => {
    if (submitting) {
      return;
    }

    setSelectedAssignment(null);
    setSubmissionText("");
  };

  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      return;
    }

    setError("");
    setSuccess("");

    if (!submissionText.trim()) {
      setError(
        "Please enter your assignment submission."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiRequest(
        "/submissions",
        {
          method: "POST",
          body: {
            assignmentId:
              selectedAssignment._id,
            submissionText:
              submissionText.trim(),
          },
        }
      );

      setSuccess(
        response.message ||
          "Assignment submitted successfully"
      );

      setSelectedAssignment(null);
      setSubmissionText("");

      await fetchSubmissions();
    } catch (error) {
      console.error(
        "Submit assignment error:",
        error
      );

      setError(
        error.message ||
          "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
  // CHECK DUE DATE
  // ==========================================

  const isPastDue = (date) => {
    if (!date) {
      return false;
    }

    return new Date(date) < new Date();
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (submission) => {
    if (!submission) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <AlertCircle size={14} />
          Not Submitted
        </span>
      );
    }

    if (submission.status === "Graded") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={14} />
          Graded
        </span>
      );
    }

    if (submission.status === "Late") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          <Clock size={14} />
          Submitted Late
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <CheckCircle size={14} />
        Submitted
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <ClipboardList
              size={26}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Assignments
            </h1>

            <p className="mt-1 text-slate-500">
              View assignments, submit your work
              and track feedback.
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
          <p className="text-sm text-slate-500">
            Total Assignments
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {assignments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Submitted
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {submissions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Graded
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              submissions.filter(
                (submission) =>
                  submission.status ===
                  "Graded"
              ).length
            }
          </p>
        </div>
      </div>

      {/* ======================================
          ASSIGNMENT LIST
      ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Available Assignments
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={32}
              className="animate-spin text-blue-600"
            />
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList
              size={48}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-700">
              No assignments available
            </h3>

            <p className="mt-1 text-slate-500">
              Your faculty has not added any
              assignments yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map((assignment) => {
              const submission =
                submissionMap[
                  assignment._id
                ];

              const pastDue = isPastDue(
                assignment.dueDate
              );

              return (
                <div
                  key={assignment._id}
                  className="p-6 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* ASSIGNMENT INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-lg bg-blue-50 p-2">
                          <ClipboardList
                            size={20}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {assignment.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <BookOpen
                                size={15}
                              />

                              {
                                assignment.course
                                  ?.courseCode
                              }
                            </span>

                            <span>
                              {
                                assignment.course
                                  ?.courseName
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                        {
                          assignment.description
                        }
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                          <Calendar
                            size={15}
                          />
                          Due:{" "}
                          {formatDate(
                            assignment.dueDate
                          )}
                        </span>

                        <span className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700">
                          {
                            assignment.totalMarks
                          }{" "}
                          Marks
                        </span>

                        {getStatusBadge(
                          submission
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setViewSubmission({
                            assignment,
                            submission,
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Eye size={17} />
                        View
                      </button>

                      {!submission && (
                        <button
                          type="button"
                          onClick={() =>
                            openSubmissionForm(
                              assignment
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <Send size={17} />
                          {pastDue
                            ? "Submit Late"
                            : "Submit"}
                        </button>
                      )}

                      {submission && (
                        <button
                          type="button"
                          disabled
                          className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                        >
                          <CheckCircle
                            size={17}
                          />
                          Already Submitted
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================
          SUBMISSION MODAL
      ====================================== */}

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Submit Assignment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    selectedAssignment.title
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeSubmissionForm
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* ASSIGNMENT DETAILS */}

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Course
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        selectedAssignment
                          .course
                          ?.courseCode
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Due Date
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDate(
                        selectedAssignment.dueDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Maximum Marks
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        selectedAssignment.totalMarks
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Assignment Description
                </p>

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  {
                    selectedAssignment.description
                  }
                </div>
              </div>

              {/* SUBMISSION TEXT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Submission *
                </label>

                <textarea
                  value={submissionText}
                  onChange={(event) =>
                    setSubmissionText(
                      event.target.value
                    )
                  }
                  rows={10}
                  placeholder="Enter your assignment answer, explanation, code, or solution here..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  File upload is not enabled in
                  the current submission API. Submit
                  your work as text for now.
                </p>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={
                    closeSubmissionForm
                  }
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================
          VIEW SUBMISSION MODAL
      ====================================== */}

      {viewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Assignment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    viewSubmission.assignment
                      .title
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewSubmission(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Description
                </p>

                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  {
                    viewSubmission.assignment
                      .description
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Course
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      viewSubmission.assignment
                        .course?.courseCode
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Due Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(
                      viewSubmission.assignment
                        .dueDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Marks
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      viewSubmission.assignment
                        .totalMarks
                    }
                  </p>
                </div>
              </div>

              {viewSubmission.submission ? (
                <>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Your Submission
                    </p>

                    <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      {
                        viewSubmission
                          .submission
                          .submissionText
                      }
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-blue-600">
                      Submission Status
                    </p>

                    <div className="mt-2">
                      {getStatusBadge(
                        viewSubmission.submission
                      )}
                    </div>
                  </div>

                  {viewSubmission.submission
                    .status === "Graded" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-green-50 p-4">
                        <p className="text-sm text-green-600">
                          Marks Obtained
                        </p>

                        <p className="mt-1 text-2xl font-bold text-green-700">
                          {
                            viewSubmission
                              .submission
                              .marksObtained
                          }{" "}
                          /{" "}
                          {
                            viewSubmission
                              .assignment
                              .totalMarks
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-purple-50 p-4">
                        <p className="text-sm text-purple-600">
                          Percentage
                        </p>

                        <p className="mt-1 text-2xl font-bold text-purple-700">
                          {Math.round(
                            (viewSubmission
                              .submission
                              .marksObtained /
                              viewSubmission
                                .assignment
                                .totalMarks) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  )}

                  {viewSubmission.submission
                    .feedback && (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-sm font-semibold text-yellow-800">
                        Faculty Feedback
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-yellow-900">
                        {
                          viewSubmission
                            .submission
                            .feedback
                        }
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <AlertCircle
                    size={30}
                    className="mx-auto mb-2 text-slate-400"
                  />

                  <p className="font-semibold text-slate-700">
                    You have not submitted this
                    assignment yet.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Close this window and click
                    Submit to submit your work.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}