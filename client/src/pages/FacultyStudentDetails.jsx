import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";

function FacultyStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
    fetchPerformance();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student");
      }

      setStudent(data.student);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/students/${id}/academic-performance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch academic performance"
        );
      }

      setPerformance(data.performance || []);
    } catch (error) {
      console.error(error);
    } finally {
      setPerformanceLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout
        role="faculty"
        title="Student Details"
        description="View student information and academic performance"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">Loading student details...</p>
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
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-red-600">
          {error || "Student not found"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      role="faculty"
      title="Student Details"
      description="View student information and academic performance"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/faculty-students")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#4f46e5] hover:underline"
      >
        ← Back to Students
      </button>

      {/* Student Profile Card */}
      <div className="mb-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-violet-600">
              Student Profile
            </p>

            <h1 className="text-2xl font-bold text-[#172033]">
              {student.user?.name || "Student"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {student.user?.email || "No email available"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoBox
              label="Student ID"
              value={student.studentId}
            />

            <InfoBox
              label="Department"
              value={student.department}
            />

            <InfoBox
              label="Semester"
              value={student.semester}
            />

            <InfoBox
              label="Section"
              value={student.section}
            />
          </div>
        </div>
      </div>

      {/* Academic Performance */}
      <div className="rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#172033]">
            Academic Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Subject-wise academic performance of {student.studentId}
          </p>
        </div>

        {performanceLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading academic performance...
          </div>
        ) : performance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No academic records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf9ff] text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Credits
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Internal
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    External
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                    Grade
                  </th>
                </tr>
              </thead>

              <tbody>
                {performance.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-[#faf9ff]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#172033]">
                        {item.courseCode}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.courseName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.credits}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.internalMarks}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.externalMarks}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#172033]">
                        {item.totalMarks}
                      </span>
                      <span className="text-gray-400"> / 100</span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.grade === "A"
                            ? "bg-green-50 text-green-700"
                            : item.grade === "B+"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-violet-50 text-violet-700"
                        }`}
                      >
                        {item.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f8f7ff] px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#172033]">{value}</p>
    </div>
  );
}

export default FacultyStudentDetails;