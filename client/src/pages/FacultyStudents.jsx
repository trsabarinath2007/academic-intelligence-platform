import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

function FacultyStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    studentId: "",
    department: "",
    semester: "",
    section: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(response.data.students || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load students."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => {
    const values = students
      .map((student) => student.department)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.user?.name || "";
      const email = student.user?.email || "";
      const studentId = student.studentId || "";
      const studentDepartment = student.department || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        studentId.toLowerCase().includes(searchText) ||
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText);

      const matchesDepartment =
        department === "All" ||
        studentDepartment === department;

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, department]);

  // Open edit modal
  const handleEdit = (student) => {
    setSelectedStudent(student);

    setEditForm({
      studentId: student.studentId || "",
      department: student.department || "",
      semester: student.semester || "",
      section: student.section || "",
    });

    setEditError("");
    setEditSuccess("");
    setEditOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    if (saving) return;

    setEditOpen(false);
    setSelectedStudent(null);
    setEditError("");
    setEditSuccess("");
  };

  // Handle form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save student
  const handleSaveStudent = async (e) => {
    e.preventDefault();

    if (!selectedStudent) return;

    if (!editForm.studentId.trim()) {
      setEditError("Student ID is required.");
      return;
    }

    if (!editForm.department.trim()) {
      setEditError("Department is required.");
      return;
    }

    if (!editForm.semester) {
      setEditError("Semester is required.");
      return;
    }

    if (!editForm.section.trim()) {
      setEditError("Section is required.");
      return;
    }

    try {
      setSaving(true);
      setEditError("");
      setEditSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        {
          studentId: editForm.studentId.trim(),
          department: editForm.department.trim(),
          semester: Number(editForm.semester),
          section: editForm.section.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedStudent = response.data.student;

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === selectedStudent._id
            ? updatedStudent
            : student
        )
      );

      setEditSuccess("Student updated successfully.");

      setTimeout(() => {
        setEditOpen(false);
        setSelectedStudent(null);
        setEditSuccess("");
      }, 800);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setEditError(
          "Your session has expired. Please login again."
        );
      } else {
        setEditError(
          err.response?.data?.message ||
            "Failed to update student."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout
      role="faculty"
      title="Students"
      description="View and manage student information"
    >
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Students
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            View student profiles and academic information.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Students */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Total Students
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#172033]">
              {students.length}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Students registered
            </p>
          </div>

          {/* Departments */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Departments
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#315EFB]">
              {Math.max(departments.length - 1, 0)}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Departments represented
            </p>
          </div>

          {/* Showing */}
          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Showing
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#7C5CF6]">
              {filteredStudents.length}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Matching students
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="w-full lg:max-w-md">
              <input
                type="text"
                placeholder="Search student ID, name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
              />
            </div>

            {/* Department Filter */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#315EFB]"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Departments"
                    : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          {/* Table Header */}
          <div className="border-b border-[#E6EAF0] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#172033]">
              Student List
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              {filteredStudents.length} student
              {filteredStudents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E6EAF0] border-t-[#315EFB]" />

                <p className="mt-4 text-sm text-[#667085]">
                  Loading students...
                </p>
              </div>
            </div>
          ) : error ? (
            /* Error */
            <div className="flex min-h-[300px] items-center justify-center px-6">
              <div className="text-center">
                <p className="text-sm text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchStudents}
                  className="mt-4 rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#244bd1]"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            /* Empty */
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-[#172033]">
                  No students found
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  Try changing your search or filter.
                </p>
              </div>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">

                <thead className="bg-[#F8FAFC]">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Student
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Semester
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Section
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F5]">

                  {filteredStudents.map((student) => {

                    const name =
                      student.user?.name || "Unknown Student";

                    const email =
                      student.user?.email || "—";

                    const initials = name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={student._id}
                        className="transition hover:bg-[#F8FAFC]"
                      >

                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-sm font-semibold text-[#315EFB]">
                              {initials}
                            </div>

                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/faculty-students/${student._id}`
                                  )
                                }
                                className="font-semibold text-[#315EFB] transition hover:underline"
                              >
                                {student.studentId}
                              </button>

                              <p className="mt-0.5 text-sm text-[#172033]">
                                {name}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {email}
                        </td>

                        {/* Department */}
                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.department || "—"}
                        </td>

                        {/* Semester */}
                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.semester
                            ? `Semester ${student.semester}`
                            : "—"}
                        </td>

                        {/* Section */}
                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.section || "—"}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/faculty-students/${student._id}`
                                )
                              }
                              className="rounded-lg border border-[#DDE2EA] bg-white px-3 py-2 text-xs font-medium text-[#315EFB] transition hover:border-[#315EFB] hover:bg-[#EEF3FF]"
                            >
                              View Details
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(student)
                              }
                              className="rounded-lg border border-[#DDE2EA] bg-white px-3 py-2 text-xs font-medium text-[#7C5CF6] transition hover:border-[#7C5CF6] hover:bg-[#F4F1FF]"
                            >
                              Edit
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      {editOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11152b]/40 px-4 py-6 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E6EAF0] px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-[#172033]">
                  Edit Student
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  Update student academic information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#667085] transition hover:bg-[#F4F6F8] hover:text-[#172033] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSaveStudent}
              className="space-y-5 p-6"
            >

              {/* Student Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    selectedStudent.user?.name ||
                    ""
                  }
                  disabled
                  className="w-full rounded-xl border border-[#DDE2EA] bg-[#F2F4F7] px-4 py-3 text-sm text-[#667085]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    selectedStudent.user?.email ||
                    ""
                  }
                  disabled
                  className="w-full rounded-xl border border-[#DDE2EA] bg-[#F2F4F7] px-4 py-3 text-sm text-[#667085]"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Student ID
                </label>

                <input
                  type="text"
                  name="studentId"
                  value={editForm.studentId}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-[#DDE2EA] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-xl border border-[#DDE2EA] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Semester */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Semester
                </label>

                <select
                  name="semester"
                  value={editForm.semester}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-[#DDE2EA] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
                >
                  <option value="">
                    Select Semester
                  </option>

                  {[1, 2, 3, 4, 5, 6, 7, 8].map(
                    (semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        Semester {semester}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">
                  Section
                </label>

                <input
                  type="text"
                  name="section"
                  value={editForm.section}
                  onChange={handleEditChange}
                  placeholder="e.g. A"
                  className="w-full rounded-xl border border-[#DDE2EA] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
                />
              </div>

              {/* Error */}
              {editError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {editError}
                </div>
              )}

              {/* Success */}
              {editSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  {editSuccess}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-[#DDE2EA] bg-white px-5 py-3 text-sm font-medium text-[#667085] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-[#315EFB] to-[#7C5CF6] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default FacultyStudents;