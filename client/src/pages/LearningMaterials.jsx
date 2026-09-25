import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Video,
  Download,
  Search,
  Filter,
} from "lucide-react";

import { apiRequest } from "../api";

export default function LearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  useEffect(() => {
    fetchMaterials();
  }, []);

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
              Access your course learning resources.
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

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Learning Materials</h1>

          <p>
            Search and access your course
            learning resources.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="card">
          <p>{error}</p>
        </div>
      )}

      {/* SEARCH + FILTERS */}

      {!error && materials.length > 0 && (
        <div className="card">

          <div className="section-heading">
            <div>
              <h2>
                <Filter size={20} />
                Find Materials
              </h2>

              <p>
                Search by title, course or topic.
              </p>
            </div>
          </div>

          <div className="form-grid">

            {/* SEARCH */}

            <div className="form-group">
              <label>
                Search
              </label>

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

            {/* COURSE */}

            <div className="form-group">
              <label>
                Course
              </label>

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

            {/* TOPIC */}

            <div className="form-group">
              <label>
                Topic
              </label>

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

            {/* TYPE */}

            <div className="form-group">
              <label>
                Type
              </label>

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

      {/* EMPTY STATE */}

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

      {/* NO FILTER RESULTS */}

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

      {/* MATERIAL CARDS */}

      <div className="card-grid">

        {filteredMaterials.map((material) => (
          <div
            className="card"
            key={material._id}
          >

            <div className="card-icon">
              {getIcon(material.type)}
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
                Topic: {material.topic}
              </div>
            )}

            <div className="muted">
              Faculty:{" "}
              {material.faculty?.name}
            </div>

            <div className="material-actions">

              {material.fileUrl && (
                <>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <FileText size={16} />
                    Open Material
                  </a>

                  <a
                    href={material.fileUrl}
                    download
                    className="btn btn-secondary"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </>
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

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}