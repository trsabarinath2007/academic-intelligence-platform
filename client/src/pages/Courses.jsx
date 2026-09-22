import React, { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch courses"
          );
        }

        setCourses(data.courses || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          Loading courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-xl font-bold text-red-600">
            Error
          </h1>

          <p className="mb-5 text-gray-600">
            {error}
          </p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              Academic Intelligence
            </h1>

            <p className="text-xs text-gray-500">
              Student Portal
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                window.location.href =
                  "/student-dashboard";
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Courses
          </h1>

          <p className="mt-1 text-gray-500">
            View your current semester courses.
          </p>
        </div>

        {/* Course Count */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Courses
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {courses.length}
          </p>

        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {courses.map((course) => (
              <div
                key={course._id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Course Code */}
                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-bold text-blue-600">
                    {course.courseCode}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {course.credits} Credits
                  </span>

                </div>

                {/* Course Name */}
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {course.courseName}
                </h2>

                {/* Course Details */}
                <div className="space-y-3">

                  <div>
                    <p className="text-xs text-gray-500">
                      Department
                    </p>

                    <p className="font-medium text-gray-700">
                      {course.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Semester
                    </p>

                    <p className="font-medium text-gray-700">
                      {course.semester}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No courses found.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default Courses;