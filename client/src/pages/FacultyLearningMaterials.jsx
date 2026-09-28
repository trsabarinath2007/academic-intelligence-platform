import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Upload,
  X,
} from "lucide-react";

import { apiRequest } from "../api";

export default function FacultyLearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    type: "document",
    topic: "",
    externalUrl: "",
    isPublished: true,
    file: null,
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        "/learning-materials/faculty",
        {
          method: "GET",
        }
      );

      setMaterials(response.materials || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load learning materials."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiRequest(
        "/courses",
        {
          method: "GET",
        }
      );

      setCourses(response.courses || []);
    } catch (err) {
      console.error(
        "Course loading error:",
        err
      );
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      course: "",
      type: "document",
      topic: "",
      externalUrl: "",
      isPublished: true,
      file: null,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!form.course) {
        setError("Please select a course.");
        return;
      }

      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "course",
        form.course
      );

      formData.append(
        "type",
        form.type
      );

      formData.append(
        "topic",
        form.topic.trim()
      );

      formData.append(
        "externalUrl",
        form.externalUrl.trim()
      );

      formData.append(
        "isPublished",
        String(form.isPublished)
      );

      if (form.file) {
        formData.append(
          "file",
          form.file
        );
      }

      const endpoint = editingId
        ? `/learning-materials/${editingId}`
        : "/learning-materials";

      const response = await apiRequest(
        endpoint,
        {
          method: editingId
            ? "PUT"
            : "POST",
          body: formData,
        }
      );

      setMessage(
        response.message ||
          "Learning material saved successfully."
      );

      resetForm();
      await fetchMaterials();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save learning material."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (material) => {
    setEditingId(material._id);

    setForm({
      title: material.title || "",
      description:
        material.description || "",
      course:
        material.course?._id || "",
      type:
        material.type || "document",
      topic: material.topic || "",
      externalUrl:
        material.externalUrl || "",
      isPublished:
        material.isPublished === true,
      file: null,
    });

    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleDelete = async (materialId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this learning material?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await apiRequest(
        `/learning-materials/${materialId}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        response.message ||
          "Learning material deleted successfully."
      );

      await fetchMaterials();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete learning material."
      );
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Learning Materials</h1>
            <p>
              Manage your course learning
              resources.
            </p>
          </div>
        </div>

        <div className="card">
          Loading learning materials...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Learning Materials</h1>
          <p>
            Create, update and manage your
            learning resources.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null);
            setForm({
              title: "",
              description: "",
              course: "",
              type: "document",
              topic: "",
              externalUrl: "",
              isPublished: true,
              file: null,
            });
            setShowForm(true);
            setMessage("");
            setError("");
          }}
        >
          <Plus size={17} />
          Add Material
        </button>
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

      {showForm && (
        <div className="card">
          <div className="section-heading">
            <div>
              <h2>
                {editingId
                  ? "Edit Learning Material"
                  : "Add Learning Material"}
              </h2>

              <p>
                Add a document, video, link or
                other learning resource.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              <X size={16} />
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter material title"
                />
              </div>

              <div className="form-group">
                <label>Course *</label>

                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} -{" "}
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Type *</label>

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
                    Link
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
                  placeholder="Example: Binary Trees"
                />
              </div>

              <div className="form-group">
                <label>External URL</label>

                <input
                  type="url"
                  name="externalUrl"
                  value={form.externalUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Upload File</label>

                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter material description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    style={{
                      width: "auto",
                      marginRight: "8px",
                    }}
                  />

                  Publish immediately
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Upload size={16} />

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Material"
                  : "Create Material"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="section-heading">
          <div>
            <h2>
              <BookOpen size={20} />
              My Learning Materials
            </h2>

            <p>
              {materials.length} material(s)
              created by you.
            </p>
          </div>
        </div>

        {materials.length === 0 ? (
          <div>
            <h3>
              No learning materials yet
            </h3>

            <p>
              Click "Add Material" to create
              your first learning resource.
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {materials.map((material) => (
              <div
                className="card"
                key={material._id}
              >
                <div className="card-icon">
                  <BookOpen size={20} />
                </div>

                <h3>
                  {material.title}
                </h3>

                <p>
                  {material.description ||
                    "No description available."}
                </p>

                <div className="muted">
                  <strong>
                    {material.course?.courseCode}
                  </strong>{" "}
                  —{" "}
                  {material.course?.courseName}
                </div>

                {material.topic && (
                  <div className="muted">
                    Topic:{" "}
                    {material.topic}
                  </div>
                )}

                <div className="muted">
                  Type: {material.type}
                </div>

                <div className="muted">
                  Status:{" "}
                  {material.isPublished
                    ? "Published"
                    : "Draft"}
                </div>

                {material.fileUrl && (
                  <div
                    className="muted"
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    File available
                  </div>
                )}

                {material.externalUrl && (
                  <div
                    className="muted"
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    External link available
                  </div>
                )}

                <div
                  className="material-actions"
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      handleEdit(material)
                    }
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      handleDelete(
                        material._id
                      )
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}