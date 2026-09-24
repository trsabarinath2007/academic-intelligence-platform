import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  Layers3,
  Building2,
} from "lucide-react";
import Layout from "../components/Layout";

const API_URL = "http://localhost:5000/api/courses";

const emptyForm = {
  courseCode: "",
  courseName: "",
  credits: "",
  department: "",
  semester: "",
};

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  const [deleteCourse, setDeleteCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setCourses(data.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        course.courseCode?.toLowerCase().includes(searchText) ||
        course.courseName?.toLowerCase().includes(searchText) ||
        course.department?.toLowerCase().includes(searchText);

      const matchesSemester =
        semesterFilter === "all" ||
        String(course.semester) === semesterFilter;

      return matchesSearch && matchesSemester;
    });
  }, [courses, search, semesterFilter]);

  // Unique semesters
  const semesters = useMemo(() => {
    return [...new Set(courses.map((course) => course.semester))]
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [courses]);

  // Open add modal
  const openAddModal = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (course) => {
    setEditingCourse(course);

    setForm({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      credits: course.credits || "",
      department: course.department || "",
      semester: course.semester || "",
    });

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCourse(null);
    setForm(emptyForm);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.courseCode.trim() ||
      !form.courseName.trim() ||
      !form.credits ||
      !form.department.trim() ||
      !form.semester
    ) {
      alert("Please fill all course fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        courseCode: form.courseCode.trim().toUpperCase(),
        courseName: form.courseName.trim(),
        credits: Number(form.credits),
        department: form.department.trim(),
        semester: Number(form.semester),
      };

      const url = editingCourse
        ? `${API_URL}/${editingCourse._id}`
        : API_URL;

      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save course");
      }

      if (editingCourse) {
        setCourses((prev) =>
          prev.map((course) =>
            course._id === editingCourse._id
              ? data.course
              : course
          )
        );
      } else {
        setCourses((prev) => [...prev, data.course]);
      }

      closeModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const handleDelete = async () => {
    if (!deleteCourse) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/${deleteCourse._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      setCourses((prev) =>
        prev.filter(
          (course) => course._id !== deleteCourse._id
        )
      );

      setDeleteCourse(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalCredits = courses.reduce(
    (sum, course) => sum + Number(course.credits || 0),
    0
  );

  const departments = new Set(
    courses.map((course) => course.department)
  ).size;

  return (
    <Layout
      role="admin"
      title="Course Management"
      description="Manage academic courses and curriculum details"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3FF]">
                <BookOpen
                  size={23}
                  className="text-[#315EFB]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#172033]">
                  Course Management
                </h1>

                <p className="mt-1 text-sm text-[#667085]">
                  Create, update and manage academic courses
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315EFB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2449d8]"
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Courses */}
          <div className="rounded-2xl border border-[#E8E6F4] bg-white p-5 shadow-[0_8px_30px_rgba(50,40,120,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Total Courses
                </p>

                <p className="mt-2 text-3xl font-bold text-[#172033]">
                  {courses.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3FF]">
                <BookOpen
                  size={20}
                  className="text-[#315EFB]"
                />
              </div>
            </div>
          </div>

          {/* Total Credits */}
          <div className="rounded-2xl border border-[#E8E6F4] bg-white p-5 shadow-[0_8px_30px_rgba(50,40,120,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Total Credits
                </p>

                <p className="mt-2 text-3xl font-bold text-[#172033]">
                  {totalCredits}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF]">
                <Layers3
                  size={20}
                  className="text-[#7257D9]"
                />
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="rounded-2xl border border-[#E8E6F4] bg-white p-5 shadow-[0_8px_30px_rgba(50,40,120,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  Departments
                </p>

                <p className="mt-2 text-3xl font-bold text-[#172033]">
                  {departments}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0FF]">
                <Building2
                  size={20}
                  className="text-[#8A63D8]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="rounded-2xl border border-[#E8E6F4] bg-white p-4 shadow-[0_8px_30px_rgba(50,40,120,0.05)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course code, name or department..."
                className="h-12 w-full rounded-xl border border-[#E4E7EC] bg-[#FAFBFF] pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
              />
            </div>

            {/* Semester */}
            <select
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(e.target.value)
              }
              className="h-12 rounded-xl border border-[#E4E7EC] bg-[#FAFBFF] px-4 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
            >
              <option value="all">
                All Semesters
              </option>

              {semesters.map((semester) => (
                <option
                  key={semester}
                  value={semester}
                >
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E8E6F4] bg-white shadow-[0_8px_30px_rgba(50,40,120,0.05)]">

          <div className="border-b border-[#EEF0F4] px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">
                  Courses
                </h2>

                <p className="text-sm text-[#667085]">
                  {filteredCourses.length} course
                  {filteredCourses.length !== 1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E4E7EC] border-t-[#315EFB]" />

                <p className="mt-3 text-sm text-[#667085]">
                  Loading courses...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[250px] items-center justify-center px-6">
              <div className="text-center">
                <p className="font-medium text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchCourses}
                  className="mt-4 rounded-lg bg-[#315EFB] px-4 py-2 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredCourses.length === 0 && (
              <div className="flex min-h-[250px] items-center justify-center px-6">
                <div className="text-center">
                  <BookOpen
                    size={38}
                    className="mx-auto text-[#98A2B3]"
                  />

                  <p className="mt-3 font-semibold text-[#172033]">
                    No courses found
                  </p>

                  <p className="mt-1 text-sm text-[#667085]">
                    Try changing your search or filter.
                  </p>
                </div>
              </div>
            )}

          {/* Desktop Table */}
          {!loading &&
            !error &&
            filteredCourses.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">

                  <thead>
                    <tr className="border-b border-[#EEF0F4] bg-[#FAFBFF] text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        Course
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        Department
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        Semester
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        Credits
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#667085]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="border-b border-[#F0F1F5] transition hover:bg-[#FBFCFF]"
                      >
                        {/* Course */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF]">
                              <GraduationCap
                                size={19}
                                className="text-[#315EFB]"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-[#315EFB]">
                                {course.courseCode}
                              </p>

                              <p className="mt-0.5 text-sm text-[#172033]">
                                {course.courseName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-5 text-sm text-[#667085]">
                          {course.department || "—"}
                        </td>

                        {/* Semester */}
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-[#F0ECFF] px-3 py-1.5 text-xs font-semibold text-[#7257D9]">
                            Semester {course.semester}
                          </span>
                        </td>

                        {/* Credits */}
                        <td className="px-6 py-5 text-sm font-medium text-[#172033]">
                          {course.credits}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(course)
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9E1FF] bg-[#F6F8FF] px-3 text-xs font-semibold text-[#315EFB] transition hover:bg-[#EEF3FF]"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteCourse(course)
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FFF7F7] px-3 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2]"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11152B]/45 p-4 backdrop-blur-sm">

          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EEF0F4] px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#172033]">
                  {editingCourse
                    ? "Edit Course"
                    : "Add New Course"}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  {editingCourse
                    ? "Update course information"
                    : "Enter the details for the new course"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#172033]"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Course Code */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Course Code
                </label>

                <input
                  type="text"
                  name="courseCode"
                  value={form.courseCode}
                  onChange={handleChange}
                  placeholder="Example: CS506"
                  maxLength={20}
                  required
                  className="h-11 w-full rounded-xl border border-[#D0D5DD] px-4 text-sm uppercase text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Course Name
                </label>

                <input
                  type="text"
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  placeholder="Example: Artificial Intelligence"
                  required
                  className="h-11 w-full rounded-xl border border-[#D0D5DD] px-4 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Credits + Semester */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    value={form.credits}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="4"
                    required
                    className="h-11 w-full rounded-xl border border-[#D0D5DD] px-4 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-4 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
                  >
                    <option value="">
                      Select semester
                    </option>

                    {Array.from(
                      { length: 8 },
                      (_, index) => index + 1
                    ).map((semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Example: Computer Science"
                  required
                  className="h-11 w-full rounded-xl border border-[#D0D5DD] px-4 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-4 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#D0D5DD] px-5 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2449D8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#11152B]/45 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2]">
              <Trash2
                size={22}
                className="text-[#DC2626]"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#172033]">
              Delete Course?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#172033]">
                {deleteCourse.courseCode}
              </span>{" "}
              — {deleteCourse.courseName}?
            </p>

            <p className="mt-3 rounded-lg bg-[#FFF7ED] px-3 py-2 text-xs leading-5 text-[#9A3412]">
              Make sure this course is not being used by
              academic records, attendance, assignments or
              quizzes.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setDeleteCourse(null)}
                disabled={deleting}
                className="rounded-xl border border-[#D0D5DD] px-5 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-[#DC2626] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Course"}
              </button>

            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AdminCourses;