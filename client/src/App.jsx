import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import Courses from "./pages/Courses";
import LearningMaterials from "./pages/LearningMaterials";
import AcademicRecords from "./pages/AcademicRecords";
import Attendance from "./pages/Attendance";
import QuizPerformance from "./pages/QuizPerformance";
import AssignmentPerformance from "./pages/AssignmentPerformance";
import PerformanceInsights from "./pages/PerformanceInsights";

import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyStudents from "./pages/FacultyStudents";
import FacultyCourses from "./pages/FacultyCourses";
import FacultyAttendance from "./pages/FacultyAttendance";
import FacultyAssignments from "./pages/FacultyAssignments";
import FacultySubmissions from "./pages/FacultySubmissions";
import FacultyAnalytics from "./pages/FacultyAnalytics";
import FacultyStudentDetails from "./pages/FacultyStudentDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ================= STUDENT ================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student-profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student-courses"
          element={<Courses />}
        />

        <Route
          path="/learning-materials"
          element={<LearningMaterials />}
        />

        <Route
          path="/academic-records"
          element={<AcademicRecords />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/quiz-performance"
          element={<QuizPerformance />}
        />

        <Route
          path="/assignment-performance"
          element={<AssignmentPerformance />}
        />

        <Route
          path="/performance-insights"
          element={<PerformanceInsights />}
        />

        {/* ================= FACULTY ================= */}

        <Route
          path="/faculty-dashboard"
          element={<FacultyDashboard />}
        />

        <Route
          path="/faculty-students"
          element={<FacultyStudents />}
        />

        <Route
          path="/faculty-student-details/:id"
          element={<FacultyStudentDetails />}
        />

        <Route
          path="/faculty-courses"
          element={<FacultyCourses />}
        />

        <Route
          path="/faculty-attendance"
          element={<FacultyAttendance />}
        />

        <Route
          path="/faculty-assignments"
          element={<FacultyAssignments />}
        />

        <Route
          path="/faculty-submissions"
          element={<FacultySubmissions />}
        />

        <Route
          path="/faculty-analytics"
          element={<FacultyAnalytics />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-students"
          element={<AdminStudents />}
        />

        <Route
          path="/admin-courses"
          element={<AdminCourses />}
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}