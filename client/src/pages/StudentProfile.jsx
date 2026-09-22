import React, { useEffect, useState } from "react";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          "http://localhost:5000/api/students/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch profile"
          );
        }

        setStudent(data.student);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
          Loading profile...
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

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {student?.user?.name || "Student"}
              </p>

              <p className="text-xs text-gray-500">
                {student?.studentId || ""}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              {student?.user?.name
                ? student.user.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Profile
          </h1>

          <p className="mt-1 text-gray-500">
            View your academic and personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 rounded-xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex flex-col items-center gap-4 border-b border-gray-200 pb-8 sm:flex-row">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
              {student?.user?.name
                ? student.user.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {student?.user?.name || "-"}
              </h2>

              <p className="text-gray-500">
                {student?.user?.email || "-"}
              </p>

              <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                {student?.user?.role || "student"}
              </span>
            </div>

          </div>

          {/* Information */}
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Student ID
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {student?.studentId || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {student?.department || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Semester
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {student?.semester || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Section
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-800">
                {student?.section || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* Account Information */}
        <div className="rounded-xl bg-white p-8 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Account Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {student?.user?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Role
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-800">
                {student?.user?.role || "-"}
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default StudentProfile;