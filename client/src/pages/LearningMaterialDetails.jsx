import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Video,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { apiRequest } from "../api";

export default function LearningMaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);

        const response = await apiRequest(
          `/learning-materials/${id}`,
          {
            method: "GET",
          }
        );

        setMaterial(response.material);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Failed to load learning material"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  const getIcon = () => {
    if (material?.type === "video") {
      return <Video size={28} />;
    }

    if (material?.type === "document") {
      return <FileText size={28} />;
    }

    return <BookOpen size={28} />;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          Loading material...
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="page">
        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate("/learning-materials")
          }
        >
          <ArrowLeft size={17} />
          Back to Materials
        </button>

        <div className="card">
          <h3>
            {error || "Learning material not found"}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* BACK */}

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() =>
          navigate("/learning-materials")
        }
      >
        <ArrowLeft size={17} />
        Back to Materials
      </button>

      {/* DETAILS */}

      <div
        className="card"
        style={{ marginTop: "20px" }}
      >

        <div className="card-icon">
          {getIcon()}
        </div>

        <h1>
          {material.title}
        </h1>

        <p>
          {material.description ||
            "No description available."}
        </p>

        <div className="muted">
          <strong>
            Course:
          </strong>{" "}
          {material.course?.courseCode} —{" "}
          {material.course?.courseName}
        </div>

        <div className="muted">
          <strong>
            Topic:
          </strong>{" "}
          {material.topic || "General"}
        </div>

        <div className="muted">
          <strong>
            Faculty:
          </strong>{" "}
          {material.faculty?.name}
        </div>

        <div className="muted">
          <strong>
            Type:
          </strong>{" "}
          {material.type}
        </div>

        {/* ACTIONS */}

        <div
          className="material-actions"
          style={{ marginTop: "24px" }}
        >

          {material.fileUrl && (
            <>
              <a
                href={material.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <FileText size={17} />
                Open Material
              </a>

              <a
                href={material.fileUrl}
                download
                className="btn btn-secondary"
              >
                <Download size={17} />
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
              <ExternalLink size={17} />
              Open External Link
            </a>
          )}

        </div>

      </div>

    </div>
  );
}