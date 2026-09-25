import React from "react";
import { Navigate } from "react-router-dom";
import { currentUser } from "../api";

export default function Dashboard() {
  const user = currentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (user.role === "faculty") {
    return <Navigate to="/faculty-dashboard" replace />;
  }

  return <Navigate to="/student-dashboard" replace />;
}