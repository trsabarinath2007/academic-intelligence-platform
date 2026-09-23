import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(response.data.students || []);
      } catch (error) {
        console.error("FETCH STUDENTS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        students
          .map((student) => student.department)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueDepartments];
  }, [students]);

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.user?.name || "";
      const email = student.user?.email || "";
      const studentId = student.studentId || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        studentId
          .toLowerCase()
          .includes(searchText) ||
        name
          .toLowerCase()
          .includes(searchText) ||
        email
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        department === "All" ||
        student.department === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });
  }, [students, search, department]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Layout
        role="faculty"
        title="Students"
        description="View and manage student information"
      >
        <div className="flex min-h-[65vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading students...
            </p>

          </div>

        </div>
      </Layout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Layout
      role="faculty"
      title="Students"
      description="View and manage student information"
    >
      <div className="space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl">

          <div className="relative z-10">

            <p className="text-sm font-medium text-blue-100">
              Faculty Management
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Student Directory
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Search, filter and view student information
              from your department.
            </p>

          </div>

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-white/5" />

        </section>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          <SummaryCard
            title="Total Students"
            value={students.length}
            icon="👥"
            description="Students in the system"
          />

          <SummaryCard
            title="Showing"
            value={filteredStudents.length}
            icon="🔎"
            description="Matching your filters"
          />

          <SummaryCard
            title="Departments"
            value={Math.max(
              departments.length - 1,
              0
            )}
            icon="🏫"
            description="Departments represented"
          />

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                ⚠️
              </div>

              <div>

                <p className="font-semibold text-red-700">
                  Unable to load students
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-1">

            <h2 className="text-lg font-bold text-slate-800">
              Find Students
            </h2>

            <p className="text-sm text-slate-500">
              Search by student ID, name or email.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">

            {/* SEARCH */}

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                type="text"
                placeholder="Search by name, email or student ID..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />

            </div>


            {/* DEPARTMENT */}

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🏫
              </span>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-10 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >

                {departments.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept === "All"
                      ? "All Departments"
                      : dept}
                  </option>
                ))}

              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </span>

            </div>

          </div>


          {/* ACTIVE FILTER */}

          {(search || department !== "All") && (

            <div className="mt-4 flex flex-wrap items-center gap-2">

              <span className="text-xs font-medium text-slate-500">
                Active filters:
              </span>

              {search && (

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  Search: {search}
                </span>

              )}

              {department !== "All" && (

                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  Department: {department}
                </span>

              )}

              <button
                onClick={() => {
                  setSearch("");
                  setDepartment("All");
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Clear
              </button>

            </div>

          )}

        </section>


        {/* =================================================
            STUDENT TABLE
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Student List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-violet-600">
                  {filteredStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {students.length}
                </span>{" "}
                students
              </p>

            </div>

            <div className="rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
              Faculty View
            </div>

          </div>


          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50/70">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Section
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map(
                    (student) => {

                      const name =
                        student.user?.name ||
                        "Unknown Student";

                      const email =
                        student.user?.email ||
                        "-";

                      const initial =
                        name
                          .charAt(0)
                          .toUpperCase();

                      return (

                        <tr
                          key={student._id}
                          className="border-b border-slate-50 transition hover:bg-violet-50/40"
                        >

                          {/* STUDENT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-sm">
                                {initial}
                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {name}
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-violet-600">
                                  {student.studentId ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td className="px-6 py-5">

                            <span className="text-sm text-slate-600">
                              {email}
                            </span>

                          </td>


                          {/* DEPARTMENT */}

                          <td className="px-6 py-5">

                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                              {student.department ||
                                "-"}
                            </span>

                          </td>


                          {/* SEMESTER */}

                          <td className="px-6 py-5 text-center">

                            <span className="font-semibold text-slate-700">
                              {student.semester ||
                                "-"}
                            </span>

                          </td>


                          {/* SECTION */}

                          <td className="px-6 py-5 text-center">

                            <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-700">
                              {student.section ||
                                "-"}
                            </span>

                          </td>


                          {/* ROLE */}

                          <td className="px-6 py-5 text-center">

                            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                              Student
                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16"
                    >

                      <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
                          🔎
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-700">
                          No students found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or
                          department filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div className="flex justify-start">

          <button
            onClick={() =>
              (window.location.href =
                "/faculty-dashboard")
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >

            <span className="transition group-hover:-translate-x-1">
              ←
            </span>

            Back to Faculty Dashboard

          </button>

        </div>

      </div>
    </Layout>
  );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl text-white shadow-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}


export default FacultyStudents;