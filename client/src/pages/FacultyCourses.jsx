import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function FacultyCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(response.data.courses || response.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  const semesters = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.semester)
          .filter((semester) => semester !== undefined)
      ),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        course.courseCode?.toLowerCase().includes(searchText) ||
        course.courseName?.toLowerCase().includes(searchText) ||
        course.department?.toLowerCase().includes(searchText);

      const matchesSemester =
        semester === "All" ||
        String(course.semester) === String(semester);

      return matchesSearch && matchesSemester;
    });
  }, [courses, search, semester]);

  return (
    <Layout
      role="faculty"
      title="Courses"
      description="View and manage academic courses"
    >
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Courses
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            View course information across the academic program.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Total Courses
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#172033]">
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Semesters
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#315EFB]">
              {Math.max(semesters.length - 1, 0)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Showing
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#7C5CF6]">
              {filteredCourses.length}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                placeholder="Search course code, name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#315EFB] focus:ring-2 focus:ring-[#315EFB]/10"
              />
            </div>

            {/* Semester */}
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#315EFB]"
            >
              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Semesters"
                    : `Semester ${item}`}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Course Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">

          <div className="border-b border-[#E6EAF0] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#172033]">
              Course List
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-sm text-[#667085]">
                Loading courses...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[250px] items-center justify-center px-6">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-sm text-[#667085]">
                No courses found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">

                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Course Code
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Course Name
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEF1F5]">

                  {filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="transition hover:bg-[#F8FAFC]"
                    >

                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#315EFB]">
                          {course.courseCode}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-[#172033]">
                          {course.courseName}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {course.department || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#667085]">
                        {course.semester
                          ? `Semester ${course.semester}`
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-[#EEF3FF] px-3 py-1 text-sm font-medium text-[#315EFB]">
                          {course.credits ?? "—"}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
}

export default FacultyCourses;