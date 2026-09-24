import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

function FacultyStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudent(response.data.student);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load student details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout
        role="faculty"
        title="Student Details"
        description="View student information"
      >
        <div className="flex min-h-[450px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E6EAF0] border-t-[#315EFB]" />

            <p className="mt-4 text-sm text-[#667085]">
              Loading student details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout
        role="faculty"
        title="Student Details"
        description="View student information"
      >
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#172033]">
            Student not found
          </h2>

          <p className="mt-2 text-sm text-red-500">
            {error || "Unable to find this student."}
          </p>

          <button
            onClick={() => navigate("/faculty-students")}
            className="mt-5 rounded-xl bg-[#315EFB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#244bd1]"
          >
            Back to Students
          </button>
        </div>
      </Layout>
    );
  }

  const user = student.user || {};

  return (
    <Layout
      role="faculty"
      title="Student Details"
      description="View detailed student information"
    >
      <div className="space-y-6">

        {/* Back Button */}
        <button
          onClick={() => navigate("/faculty-students")}
          className="flex items-center gap-2 text-sm font-medium text-[#667085] transition hover:text-[#315EFB]"
        >
          <span>←</span>
          Back to Students
        </button>

        {/* Student Header */}
        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3FF] text-xl font-semibold text-[#315EFB]">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "ST"}
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-[#172033]">
                  {user.name || "Student"}
                </h1>

                <p className="mt-1 text-sm text-[#667085]">
                  {user.email || "No email available"}
                </p>
              </div>

            </div>

            <span className="w-fit rounded-lg bg-[#EEF3FF] px-4 py-2 text-sm font-semibold text-[#315EFB]">
              {student.studentId}
            </span>

          </div>

        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Student ID
            </p>

            <p className="mt-2 text-lg font-semibold text-[#172033]">
              {student.studentId || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Department
            </p>

            <p className="mt-2 text-lg font-semibold text-[#172033]">
              {student.department || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Semester
            </p>

            <p className="mt-2 text-lg font-semibold text-[#172033]">
              {student.semester
                ? `Semester ${student.semester}`
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#667085]">
              Section
            </p>

            <p className="mt-2 text-lg font-semibold text-[#172033]">
              {student.section || "—"}
            </p>
          </div>

        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#172033]">
            Account Information
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-[#172033]">
                {user.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-[#172033]">
                {user.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">
                Role
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-[#172033]">
                {user.role || "student"}
              </p>
            </div>

          </div>

        </div>

        {/* Future Analytics */}
        <div className="rounded-2xl border border-dashed border-[#DDE2EA] bg-[#F8FAFC] p-8 text-center">

          <h2 className="text-lg font-semibold text-[#172033]">
            Student Academic Analytics
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
            Detailed GPA, attendance, quiz, assignment and
            performance-risk information can be displayed here.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">

            <button
              onClick={() => navigate("/faculty-analytics")}
              className="rounded-xl border border-[#DDE2EA] bg-white px-4 py-2.5 text-sm font-medium text-[#315EFB] transition hover:border-[#315EFB]"
            >
              View Analytics
            </button>

            <button
              onClick={() => navigate("/faculty-attendance")}
              className="rounded-xl border border-[#DDE2EA] bg-white px-4 py-2.5 text-sm font-medium text-[#667085] transition hover:border-[#315EFB] hover:text-[#315EFB]"
            >
              View Attendance
            </button>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default FacultyStudentDetails;