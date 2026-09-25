import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Video,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api";

export default function LearningMaterials() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] =
    useState("all");
  const [topicFilter, setTopicFilter] =
    useState("all");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        "/learning-materials/published",
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

  const fetchProgress = async () => {
    try {
      setProgressLoading(true);

      const [progressResponse, courseResponse] =
        await Promise.all([
          apiRequest(
            "/material-progress/student",
            {
              method: "GET",
            }
          ),
          apiRequest(
            "/material-progress/student/course-summary",
            {
              method: "GET",
            }
          ),
        ]);

      setProgress(
        progressResponse.progress || []
      );

      setCourseProgress(
        courseResponse.courses || []
      );
    } catch (err) {
      console.error(
        "Progress loading error:",
        err
      );
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchProgress();
  }, []);

  const isCompleted = (materialId) => {
    return progress.some(
      (item) =>
        item.material?._id === materialId &&
        item.completed === true
    );
  };

  const markCompleted = async (materialId) => {
    try {
      setMessage("");
      setError("");

      const response = await apiRequest(
        `/material-progress/${materialId}/complete`,
        {
          method: "PUT",
        }
      );

      setMessage(
        response.message ||
          "Material marked as completed."
      );

      await fetchProgress();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to update material progress."
      );
    }
  };

  const getIcon = (type) => {
    if (type === "video") {
      return <Video size={20} />;
    }

    if (type === "document") {
      return <FileText size={20} />;
    }

    return <BookOpen size={20} />;
  };

  const courses = useMemo(() => {
    const map = new Map();

    materials.forEach((material) => {
      if (material.course?._id) {
        map.set(
          material.course._id,
          material.course
        );
      }
    });

    return Array.from(map.values());
  }, [materials]);

  const topics = useMemo(() => {
    return [
      ...new Set(
        materials
          .map((material) => material.topic)
          .filter(Boolean)
      ),
    ].sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return materials.filter((material) => {
      const matchesSearch =
        !searchText ||
        material.title
          ?.toLowerCase()
          .includes(searchText) ||
        material.description
          ?.toLowerCase()
          .includes(searchText) ||
        material.topic
          ?.toLowerCase()
          .includes(searchText) ||
        material.course?.courseCode
          ?.toLowerCase()
          .includes(searchText) ||
        material.course?.courseName
          ?.toLowerCase()
          .includes(searchText);

      const matchesCourse =
        courseFilter === "all" ||
        material.course?._id === courseFilter;

      const matchesTopic =
        topicFilter === "all" ||
        material.topic === topicFilter;

      const matchesType =
        typeFilter === "all" ||
        material.type === typeFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesTopic &&
        matchesType
      );
    });
  }, [
    materials,
    search,
    courseFilter,
    topicFilter,
    typeFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("all");
    setTopicFilter("all");
    setTypeFilter("all");
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Learning Materials</h1>
            <p>
              Access your course learning
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
            Search and access your course
            learning resources.
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

      {!progressLoading &&
        courseProgress.length > 0 && (
          <div className="card">
            <div className="section-heading">
              <div>
                <h2>
                  <CheckCircle2 size={20} />
                  Course Material Progress
                </h2>
                <p>
                  Track your learning material
                  completion for each course.
                </p>
              </div>
            </div>

            <div className="card-grid">
              {courseProgress.map((course) => (
                <div
                  className="card"
                  key={course.courseId}
                >
                  <div className="card-icon">
                    <BookOpen size={20} />
                  </div>

                  <h3>
                    {course.courseCode}
                  </h3>

                  <p>
                    {course.courseName}
                  </p>

                  <div className="muted">
                    Completed{" "}
                    <strong>
                      {course.completedMaterials}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {course.totalMaterials}
                    </strong>{" "}
                    materials
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#e5e7eb",
                      overflow: "hidden",
                      marginTop: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: `${course.completionPercentage}%`,
                        height: "100%",
                        background:
                          "currentColor",
                        borderRadius: "999px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {course.completionPercentage}%
                    completed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {!progressLoading &&
        materials.length > 0 && (
          <div className="card">
            <h2>
              <CheckCircle2 size={20} />
              Learning Progress
            </h2>

            <p>
              Completed{" "}
              <strong>
                {
                  progress.filter(
                    (item) =>
                      item.completed
                  ).length
                }
              </strong>{" "}
              material(s)
            </p>
          </div>
        )}

      {!error && materials.length > 0 && (
        <div className="card">
          <div className="section-heading">
            <div>
              <h2>
                <Filter size={20} />
                Find Materials
              </h2>

              <p>
                Search by title, course or
                topic.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Search</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <Search
                  size={17}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                  }}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search materials..."
                  style={{
                    paddingLeft: "38px",
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Course</label>

              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Courses
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
              <label>Topic</label>

              <select
                value={topicFilter}
                onChange={(e) =>
                  setTopicFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Topics
                </option>

                {topics.map((topic) => (
                  <option
                    key={topic}
                    value={topic}
                  >
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Types
                </option>

                <option value="document">
                  Documents
                </option>

                <option value="video">
                  Videos
                </option>

                <option value="link">
                  Links
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "18px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span className="muted">
              Showing{" "}
              <strong>
                {filteredMaterials.length}
              </strong>{" "}
              of{" "}
              <strong>
                {materials.length}
              </strong>{" "}
              materials
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {!error &&
        materials.length === 0 && (
          <div className="card">
            <h3>
              No learning materials available
            </h3>

            <p>
              Faculty have not published any
              learning materials yet.
            </p>
          </div>
        )}

      {!error &&
        materials.length > 0 &&
        filteredMaterials.length === 0 && (
          <div className="card">
            <h3>
              No matching materials
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>
          </div>
        )}

      <div className="card-grid">
        {filteredMaterials.map((material) => {
          const completed = isCompleted(
            material._id
          );

          return (
            <div
              className="card"
              key={material._id}
            >
              <div className="card-icon">
                {getIcon(material.type)}
              </div>

              <h3>{material.title}</h3>

              {completed && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                    fontSize: "13px",
                  }}
                >
                  <CheckCircle2 size={16} />
                  Completed
                </div>
              )}

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
                  Topic: {material.topic}
                </div>
              )}

              <div className="muted">
                Faculty:{" "}
                {material.faculty?.name}
              </div>

              <div className="material-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      `/learning-materials/${material._id}`
                    )
                  }
                >
                  <FileText size={16} />
                  View Details
                </button>

                {material.fileUrl && (
                  <a
                    href={material.fileUrl}
                    download
                    className="btn btn-secondary"
                  >
                    <Download size={16} />
                    Download
                  </a>
                )}

                {material.externalUrl && (
                  <a
                    href={material.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <ExternalLink size={16} />
                    Open Link
                  </a>
                )}

                {!completed && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      markCompleted(
                        material._id
                      )
                    }
                  >
                    <CheckCircle2 size={16} />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}