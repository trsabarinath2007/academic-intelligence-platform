import React, { useEffect, useState } from "react";
import { BookOpen, ExternalLink, FileText, Video } from "lucide-react";
import { api } from "../api";

export default function LearningMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get(
          "/learning-materials/published"
        );

        setMaterials(response.data.materials || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load learning materials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const getIcon = (type) => {
    if (type === "video") return <Video size={20} />;
    if (type === "document") return <FileText size={20} />;
    return <BookOpen size={20} />;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Learning Materials</h1>
            <p>Access your course learning resources.</p>
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
            Access notes, videos, links and other course resources.
          </p>
        </div>
      </div>

      {error && (
        <div className="card">
          <p>{error}</p>
        </div>
      )}

      {!error && materials.length === 0 && (
        <div className="card">
          <h3>No learning materials available</h3>
          <p>
            Faculty have not published any learning materials yet.
          </p>
        </div>
      )}

      <div className="card-grid">
        {materials.map((material) => (
          <div className="card" key={material._id}>
            <div className="card-icon">
              {getIcon(material.type)}
            </div>

            <h3>{material.title}</h3>

            <p>
              {material.description ||
                "No description available."}
            </p>

            <div className="muted">
              <strong>
                {material.course?.courseCode}
              </strong>{" "}
              — {material.course?.courseName}
            </div>

            {material.topic && (
              <div className="muted">
                Topic: {material.topic}
              </div>
            )}

            <div className="muted">
              Faculty: {material.faculty?.name}
            </div>

            <div className="material-actions">
              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <FileText size={16} />
                  Open Material
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}