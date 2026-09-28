import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  ClipboardList,
  Calendar,
  BookOpen,
  Eye,
  Loader2,
} from "lucide-react";

import { apiRequest } from "../api";

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    totalMarks: "",
  });

  // ==========================================
  // FETCH ASSIGNMENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

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
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await apiRequest(
        "/courses",
        {
          method: "GET",
        }
      );

      setCourses(response.courses || []);
    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch courses"
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseId: "",
      dueDate: "",
      totalMarks: "",
    });
  };

  // ==========================================
  // OPEN FORM
  // ==========================================

  const openCreateForm = () => {
    setError("");
    setSuccess("");
    setSelectedAssignment(null);
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    resetForm();
  };

  // ==========================================
  // CREATE ASSIGNMENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Assignment title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Assignment description is required");
      return;
    }

    if (!formData.courseId) {
      setError("Please select a course");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required");
      return;
    }

    if (
      !formData.totalMarks ||
      Number(formData.totalMarks) <= 0
    ) {
      setError(
        "Total marks must be greater than 0"
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiRequest(
        "/assignments",
        {
          method: "POST",
          body: {
            title: formData.title.trim(),
            description:
              formData.description.trim(),
            courseId: formData.courseId,
            dueDate: formData.dueDate,
            totalMarks: Number(
              formData.totalMarks
            ),
          },
        }
      );

      setSuccess(
        response.message ||
          "Assignment created successfully"
      );

      setShowForm(false);
      resetForm();

      await fetchAssignments();
    } catch (error) {
      console.error(
        "Create assignment error:",
        error
      );

      setError(
        error.message ||
          "Failed to create assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // VIEW ASSIGNMENT
  // ==========================================

  const handleViewAssignment = async (
    assignmentId
  ) => {
    try {
      setError("");

      const response = await apiRequest(
        `/assignments/${assignmentId}`,
        {
          method: "GET",
        }
      );

      setSelectedAssignment(
        response.assignment
      );
    } catch (error) {
      console.error(
        "Fetch assignment error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch assignment"
      );
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
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
                Create and manage academic
                assignments.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Assignment
        </button>
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
          STATS
      ====================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {assignments.length}
              </p>
            </div>

            <ClipboardList
              size={30}
              className="text-blue-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Upcoming
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {
                  assignments.filter(
                    (assignment) =>
                      !isPastDue(
                        assignment.dueDate
                      )
                  ).length
                }
              </p>
            </div>

            <Calendar
              size={30}
              className="text-green-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Past Due
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {
                  assignments.filter(
                    (assignment) =>
                      isPastDue(
                        assignment.dueDate
                      )
                  ).length
                }
              </p>
            </div>

            <Calendar
              size={30}
              className="text-red-500"
            />
          </div>
        </div>
      </div>

      {/* ======================================
          ASSIGNMENTS TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            All Assignments
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={30}
              className="animate-spin text-blue-600"
            />
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList
              size={45}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-700">
              No assignments yet
            </h3>

            <p className="mt-1 text-slate-500">
              Create your first assignment.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Assignment
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Due Date
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
                {assignments.map(
                  (assignment) => (
                    <tr
                      key={assignment._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">
                          {assignment.title}
                        </div>

                        <div className="mt-1 max-w-md truncate text-sm text-slate-500">
                          {
                            assignment.description
                          }
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen
                            size={17}
                            className="text-blue-500"
                          />

                          <div>
                            <div className="font-medium text-slate-700">
                              {
                                assignment
                                  .course
                                  ?.courseCode
                              }
                            </div>

                            <div className="text-xs text-slate-500">
                              {
                                assignment
                                  .course
                                  ?.courseName
                              }
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            isPastDue(
                              assignment.dueDate
                            )
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {formatDate(
                            assignment.dueDate
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {assignment.totalMarks}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewAssignment(
                              assignment._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <Eye size={17} />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================
          CREATE ASSIGNMENT MODAL
      ====================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Create Assignment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new academic assignment.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Binary Tree Implementation"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* COURSE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Course *
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  disabled={coursesLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    {coursesLoading
                      ? "Loading courses..."
                      : "Select Course"}
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} -{" "}
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the assignment requirements..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DUE DATE + MARKS */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Total Marks *
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    min="1"
                    placeholder="50"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Creating..."
                    : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================
          VIEW ASSIGNMENT MODAL
      ====================================== */}

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Assignment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View assignment information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAssignment(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Title
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {selectedAssignment.title}
                </h3>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Course
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {
                    selectedAssignment.course
                      ?.courseCode
                  }{" "}
                  -{" "}
                  {
                    selectedAssignment.course
                      ?.courseName
                  }
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Description
                </p>

                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  {
                    selectedAssignment.description
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Due Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(
                      selectedAssignment.dueDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Total Marks
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      selectedAssignment.totalMarks
                    }
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-600">
                  Created By
                </p>

                <p className="mt-1 font-semibold text-blue-900">
                  {
                    selectedAssignment.createdBy
                      ?.name
                  }
                </p>

                <p className="text-sm text-blue-700">
                  {
                    selectedAssignment.createdBy
                      ?.email
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}