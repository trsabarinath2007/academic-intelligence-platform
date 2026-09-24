import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

      setError(
        err.response?.data?.message ||
          "Failed to load students."
      );
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

      const matchesSearch =
        studentId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        department === "All" ||
        student.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, department]);

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setSelectedStudent(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student._id !== selectedStudent._id
        )
      );

      setDeleteOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);

      setDeleteError(
        err.response?.data?.message ||
          "Failed to delete student."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout
      role="admin"
      title="Student Management"
      description="Manage student records and accounts"
    >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Student Management
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            View and manage registered student records.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#667085]">
              Total Students
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#172033]">
              {students.length}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              Registered students
            </p>
          </div>

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

            <input
              type="text"
              placeholder="Search student ID, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10 lg:max-w-md"
            />

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
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

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          <div className="border-b border-[#E6EAF0] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#172033]">
              Student List
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              {filteredStudents.length} student
              {filteredStudents.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

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
            <div className="flex min-h-[300px] items-center justify-center px-6">
              <div className="text-center">
                <p className="text-sm text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchStudents}
                  className="mt-4 rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#244bd1]"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
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
            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left">

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
                      student.user?.name ||
                      "Unknown Student";

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

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-sm font-semibold text-[#315EFB]">
                              {initials}
                            </div>

                            <div>
                              <p className="font-semibold text-[#172033]">
                                {student.studentId}
                              </p>

                              <p className="mt-0.5 text-sm text-[#667085]">
                                {name}
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {email}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.department || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.semester
                            ? `Semester ${student.semester}`
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#667085]">
                          {student.section || "—"}
                        </td>

                        <td className="px-6 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(student)
                            }
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-500 transition hover:border-red-300 hover:bg-red-50"
                          >
                            Delete
                          </button>

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

      {/* Delete Modal */}
      {deleteOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11152b]/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-500">
                !
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[#172033]">
                Delete Student
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#172033]">
                  {selectedStudent.user?.name ||
                    selectedStudent.studentId}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-red-500">
                This action cannot be undone.
              </p>

              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {deleteError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="rounded-xl border border-[#DDE2EA] bg-white px-5 py-3 text-sm font-medium text-[#667085] hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Student"}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}

export default AdminStudents;