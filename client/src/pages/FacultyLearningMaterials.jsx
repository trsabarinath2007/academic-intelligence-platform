import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  BookOpen,
  Pencil,
  X,
  Upload,
} from "lucide-react";

import { apiRequest } from "../api";

export default function FacultyLearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    type: "document",
    externalUrl: "",
    topic: "",
    isPublished: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await apiRequest("/courses", {
        method: "GET",
      });

      setCourses(response.courses || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load courses"
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  // ==========================================
  // FETCH MATERIALS
  // ==========================================

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
      console.error(err);

      setError(
        err.message ||
          "Failed to load learning materials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMaterials();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // FILE CHANGE
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      course: "",
      type: "document",
      externalUrl: "",
      topic: "",
      isPublished: true,
    });

    setSelectedFile(null);
    setEditingId(null);

    const fileInput =
      document.getElementById(
        "learning-material-file"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.title ||
      !form.course ||
      !form.type
    ) {
      setError(
        "Title, course and material type are required."
      );
      return;
    }

    if (
      !editingId &&
      form.type === "document" &&
      !selectedFile
    ) {
      setError(
        "Please select a document to upload."
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "description",
        form.description
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
        "externalUrl",
        form.externalUrl
      );

      formData.append(
        "topic",
        form.topic
      );

      formData.append(
        "isPublished",
        form.isPublished
      );

      if (selectedFile) {
        formData.append(
          "file",
          selectedFile
        );
      }

      let response;

      if (editingId) {
        response = await apiRequest(
          `/learning-materials/${editingId}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        response = await apiRequest(
          "/learning-materials",
          {
            method: "POST",
            body: formData,
          }
        );
      }

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
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (material) => {
    setError("");
    setMessage("");

    setEditingId(material._id);

    setForm({
      title: material.title || "",
      description:
        material.description || "",
      course:
        material.course?._id ||
        material.course ||
        "",
      type:
        material.type || "document",
      externalUrl:
        material.externalUrl || "",
      topic:
        material.topic || "",
      isPublished:
        material.isPublished !== false,
    });

    setSelectedFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await apiRequest(
        `/learning-materials/${id}`,
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

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Learning Materials</h1>

          <p>
            Upload and manage course learning
            resources.
          </p>
        </div>
      </div>

      {/* MESSAGES */}

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

      {/* FORM */}

      <div className="card">

        <div className="section-heading">
          <div>
            <h2>
              {editingId ? (
                <Pencil size={20} />
              ) : (
                <Plus size={20} />
              )}

              {editingId
                ? "Edit Learning Material"
                : "Add Learning Material"}
            </h2>

            <p>
              Add notes, videos, links or other
              resources for students.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* TITLE */}

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

            {/* COURSE */}

            <div className="form-group">
              <label>Course</label>

              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                disabled={coursesLoading}
              >
                <option value="">
                  {coursesLoading
                    ? "Loading courses..."
                    : "Select a course"}
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

            {/* TYPE */}

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

            {/* TOPIC */}

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

            {/* DESCRIPTION */}

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

            {/* FILE */}

            <div className="form-group">
              <label>
                Upload File
              </label>

              <input
                id="learning-material-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />

              {selectedFile && (
                <small>
                  Selected:{" "}
                  {selectedFile.name}
                </small>
              )}
            </div>

            {/* EXTERNAL URL */}

            <div className="form-group">
              <label>
                External URL
              </label>

              <input
                type="text"
                name="externalUrl"
                value={form.externalUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>

          </div>

          {/* PUBLISH */}

          <label className="checkbox-row">

            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />

            Publish immediately

          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            className="btn btn-primary"
          >
            {editingId ? (
              <>
                <Pencil size={17} />
                Update Material
              </>
            ) : (
              <>
                <Upload size={17} />
                Upload Material
              </>
            )}
          </button>

        </form>
      </div>

      {/* MATERIAL LIST */}

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
          <p>
            Loading materials...
          </p>
        ) : materials.length === 0 ? (
          <p>
            You have not created any learning
            materials yet.
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
                  <th>Actions</th>
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
                      <strong>
                        {material.course?.courseCode ||
                          "-"}
                      </strong>

                      <br />

                      <small>
                        {material.course?.courseName ||
                          ""}
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

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            handleEdit(material)
                          }
                          title="Edit material"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(
                              material._id
                            )
                          }
                          title="Delete material"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

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