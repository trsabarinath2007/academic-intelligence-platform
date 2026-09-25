import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

import { apiRequest } from "../api";

export default function FacultyLearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    type: "document",
    fileUrl: "",
    externalUrl: "",
    topic: "",
    isPublished: true,
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const response = await apiRequest(
        "/learning-materials/faculty",
        {
          method: "GET",
        }
      );

      setMaterials(response.materials || []);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load learning materials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.title || !form.course || !form.type) {
      setError(
        "Title, course ID and material type are required."
      );
      return;
    }

    try {
      const response = await apiRequest(
        "/learning-materials",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      setMessage(
        response.message ||
          "Learning material created successfully."
      );

      setForm({
        title: "",
        description: "",
        course: "",
        type: "document",
        fileUrl: "",
        externalUrl: "",
        topic: "",
        isPublished: true,
      });

      fetchMaterials();
    } catch (err) {
      setError(
        err.message ||
          "Failed to create learning material."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/learning-materials/${id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "Learning material deleted successfully."
      );

      fetchMaterials();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete learning material."
      );
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Learning Materials</h1>
          <p>
            Upload and manage course learning resources.
          </p>
        </div>
      </div>

      {message && (
        <div className="card">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="card">
          <p>{error}</p>
        </div>
      )}

      {/* CREATE MATERIAL */}

      <div className="card">
        <div className="section-heading">
          <div>
            <h2>
              <Plus size={20} />
              Add Learning Material
            </h2>

            <p>
              Add notes, videos, links or other
              resources for students.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Introduction to Binary Trees"
              />
            </div>

            <div className="form-group">
              <label>Course ID</label>

              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Enter course MongoDB ID"
              />
            </div>

            <div className="form-group">
              <label>Material Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="document">
                  Document
                </option>

                <option value="video">
                  Video
                </option>

                <option value="link">
                  External Link
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Topic</label>

              <input
                type="text"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="Binary Trees"
              />
            </div>

            <div className="form-group form-full">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the learning material..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>File URL</label>

              <input
                type="text"
                name="fileUrl"
                value={form.fileUrl}
                onChange={handleChange}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div className="form-group">
              <label>External URL</label>

              <input
                type="text"
                name="externalUrl"
                value={form.externalUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>

          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />

            Publish immediately
          </label>

          <button
            type="submit"
            className="btn btn-primary"
          >
            <Plus size={17} />
            Add Material
          </button>

        </form>
      </div>

      {/* EXISTING MATERIALS */}

      <div className="card">
        <div className="section-heading">
          <div>
            <h2>
              <BookOpen size={20} />
              My Learning Materials
            </h2>

            <p>
              Materials created by you.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading materials...</p>
        ) : materials.length === 0 ? (
          <p>
            You have not created any learning materials
            yet.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">

              <thead>
                <tr>
                  <th>Material</th>
                  <th>Course</th>
                  <th>Type</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {materials.map((material) => (
                  <tr key={material._id}>

                    <td>
                      <div className="table-title">
                        <FileText size={17} />

                        <div>
                          <strong>
                            {material.title}
                          </strong>

                          <small>
                            {material.description ||
                              "No description"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {material.course?.courseCode}
                      <br />
                      <small>
                        {material.course?.courseName}
                      </small>
                    </td>

                    <td>
                      {material.type}
                    </td>

                    <td>
                      {material.topic || "-"}
                    </td>

                    <td>
                      {material.isPublished
                        ? "Published"
                        : "Draft"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="icon-button danger"
                        onClick={() =>
                          handleDelete(material._id)
                        }
                        title="Delete material"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}