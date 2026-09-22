import { useEffect, useState } from "react";
import axios from "axios";

function FacultySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/submissions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const startGrading = (submission) => {
    setEditingId(submission._id);
    setMarks(submission.marksObtained ?? "");
    setFeedback(submission.feedback || "");
  };

  const cancelGrading = () => {
    setEditingId(null);
    setMarks("");
    setFeedback("");
  };

  const submitGrade = async (submission) => {
    if (marks === "") {
      alert("Please enter marks.");
      return;
    }

    const numericMarks = Number(marks);

    if (
      numericMarks < 0 ||
      numericMarks > submission.assignment.totalMarks
    ) {
      alert(
        `Marks must be between 0 and ${submission.assignment.totalMarks}`
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/submissions/${submission._id}/grade`,
        {
          marksObtained: numericMarks,
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Assignment graded successfully.");

      cancelGrading();
      fetchSubmissions();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to grade assignment"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Assignment Submissions
          </h1>

          <p className="text-gray-500 mt-1">
            Review and grade student submissions
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Submissions */}
        <div className="space-y-6">

          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-xl shadow p-6"
              >

                {/* Top section */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {submission.assignment?.title}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1">
                      {submission.assignment?.course?.courseCode} -{" "}
                      {submission.assignment?.course?.courseName}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm h-fit ${
                      submission.status === "Graded"
                        ? "bg-green-100 text-green-700"
                        : submission.status === "Late"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {submission.status}
                  </span>

                </div>

                {/* Student */}
                <div className="bg-gray-50 rounded-lg p-4 mt-5">
                  <p>
                    <span className="font-semibold">
                      Student:
                    </span>{" "}
                    {submission.student?.user?.name}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Student ID:
                    </span>{" "}
                    {submission.student?.studentId}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Department:
                    </span>{" "}
                    {submission.student?.department}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Semester:
                    </span>{" "}
                    {submission.student?.semester}
                  </p>
                </div>

                {/* Submission */}
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800">
                    Submission
                  </h3>

                  <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg">
                    {submission.submissionText}
                  </p>
                </div>

                {/* Grade */}
                {editingId === submission._id ? (
                  <div className="mt-5 border-t pt-5">

                    <h3 className="font-semibold text-gray-800 mb-4">
                      Grade Submission
                    </h3>

                    <label className="block text-sm font-medium mb-2">
                      Marks (out of{" "}
                      {submission.assignment.totalMarks})
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={submission.assignment.totalMarks}
                      value={marks}
                      onChange={(e) =>
                        setMarks(e.target.value)
                      }
                      className="border rounded-lg px-4 py-3 w-full md:w-48"
                    />

                    <label className="block text-sm font-medium mt-4 mb-2">
                      Feedback
                    </label>

                    <textarea
                      value={feedback}
                      onChange={(e) =>
                        setFeedback(e.target.value)
                      }
                      rows="4"
                      placeholder="Enter feedback..."
                      className="border rounded-lg px-4 py-3 w-full"
                    />

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() =>
                          submitGrade(submission)
                        }
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Save Grade
                      </button>

                      <button
                        onClick={cancelGrading}
                        className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>

                    </div>
                  </div>
                ) : (
                  <div className="mt-5 border-t pt-5">

                    <div className="flex flex-col md:flex-row md:justify-between gap-4">

                      <div>
                        <p>
                          <span className="font-semibold">
                            Marks:
                          </span>{" "}
                          {submission.marksObtained !== null
                            ? `${submission.marksObtained}/${submission.assignment.totalMarks}`
                            : "Not graded"}
                        </p>

                        <p className="mt-2">
                          <span className="font-semibold">
                            Feedback:
                          </span>{" "}
                          {submission.feedback ||
                            "No feedback"}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          startGrading(submission)
                        }
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 h-fit"
                      >
                        {submission.status === "Graded"
                          ? "Edit Grade"
                          : "Grade"}
                      </button>

                    </div>
                  </div>
                )}

              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <p className="text-gray-500">
                No submissions found.
              </p>
            </div>
          )}

        </div>

        {/* Back */}
        <div className="mt-6">
          <button
            onClick={() =>
              (window.location.href =
                "/faculty-dashboard")
            }
            className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Faculty Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default FacultySubmissions;