import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// AUTH / GENERAL
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import Courses from "./pages/Courses";
import LearningMaterials from "./pages/LearningMaterials";
import LearningMaterialDetails from "./pages/LearningMaterialDetails";
import AcademicRecords from "./pages/AcademicRecords";
import Attendance from "./pages/Attendance";
import QuizPerformance from "./pages/QuizPerformance";
import AssignmentPerformance from "./pages/AssignmentPerformance";
import StudentAssignments from "./pages/StudentAssignments";
import PerformanceInsights from "./pages/PerformanceInsights";
import StudentStudyAssistant from "./pages/StudentStudyAssistant";
import StudentAIAnalysis from "./pages/StudentAIAnalysis";
import StudentQuizzes from "./pages/StudentQuizzes";

// =====================================================
// FACULTY
// =====================================================

import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyStudents from "./pages/FacultyStudents";
import FacultyStudentDetails from "./pages/FacultyStudentDetails";
import FacultyCourses from "./pages/FacultyCourses";
import FacultyAttendance from "./pages/FacultyAttendance";
import FacultyAssignments from "./pages/FacultyAssignments";
import FacultySubmissions from "./pages/FacultySubmissions";
import FacultyAnalytics from "./pages/FacultyAnalytics";
import FacultyLearningMaterials from "./pages/FacultyLearningMaterials";
import FacultyAIInsights from "./pages/FacultyAIInsights";
import FacultyQuizzes from "./pages/FacultyQuizzes";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCourses from "./pages/AdminCourses";

// =====================================================
// COMMON
// =====================================================

import DiscussionForum from "./pages/DiscussionForum";
import Notifications from "./pages/Notifications";

// =====================================================
// LAYOUT
// =====================================================

import Layout from "./components/Layout";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            STUDENT ROUTES
        ================================================= */}

        <Route
          path="/student-dashboard"
          element={
            <Layout role="student">
              <StudentDashboard />
            </Layout>
          }
        />

        <Route
          path="/student-profile"
          element={
            <Layout role="student">
              <StudentProfile />
            </Layout>
          }
        />

        <Route
          path="/student-courses"
          element={
            <Layout role="student">
              <Courses />
            </Layout>
          }
        />

        <Route
          path="/learning-materials"
          element={
            <Layout role="student">
              <LearningMaterials />
            </Layout>
          }
        />

        <Route
          path="/learning-materials/:id"
          element={
            <Layout role="student">
              <LearningMaterialDetails />
            </Layout>
          }
        />

        <Route
          path="/academic-records"
          element={
            <Layout role="student">
              <AcademicRecords />
            </Layout>
          }
        />

        <Route
          path="/attendance"
          element={
            <Layout role="student">
              <Attendance />
            </Layout>
          }
        />

        <Route
          path="/quiz-performance"
          element={
            <Layout role="student">
              <QuizPerformance />
            </Layout>
          }
        />

        <Route
          path="/student-quizzes"
          element={
            <Layout role="student">
              <StudentQuizzes />
            </Layout>
          }
        />

        <Route
          path="/assignment-performance"
          element={
            <Layout role="student">
              <AssignmentPerformance />
            </Layout>
          }
        />

        <Route
          path="/student-assignments"
          element={
            <Layout role="student">
              <StudentAssignments />
            </Layout>
          }
        />

        <Route
          path="/performance-insights"
          element={
            <Layout role="student">
              <PerformanceInsights />
            </Layout>
          }
        />

        <Route
          path="/student-study-assistant"
          element={
            <Layout role="student">
              <StudentStudyAssistant />
            </Layout>
          }
        />

        <Route
          path="/student-ai-analysis"
          element={
            <Layout role="student">
              <StudentAIAnalysis />
            </Layout>
          }
        />

        {/* =================================================
            FACULTY ROUTES
        ================================================= */}

        <Route
          path="/faculty-dashboard"
          element={
            <Layout role="faculty">
              <FacultyDashboard />
            </Layout>
          }
        />

        <Route
          path="/faculty-students"
          element={
            <Layout role="faculty">
              <FacultyStudents />
            </Layout>
          }
        />

        <Route
          path="/faculty-student-details/:id"
          element={
            <Layout role="faculty">
              <FacultyStudentDetails />
            </Layout>
          }
        />

        <Route
          path="/faculty-courses"
          element={
            <Layout role="faculty">
              <FacultyCourses />
            </Layout>
          }
        />

        <Route
          path="/faculty-learning-materials"
          element={
            <Layout role="faculty">
              <FacultyLearningMaterials />
            </Layout>
          }
        />

        <Route
          path="/faculty-attendance"
          element={
            <Layout role="faculty">
              <FacultyAttendance />
            </Layout>
          }
        />

        <Route
          path="/faculty-assignments"
          element={
            <Layout role="faculty">
              <FacultyAssignments />
            </Layout>
          }
        />

        <Route
          path="/faculty-submissions"
          element={
            <Layout role="faculty">
              <FacultySubmissions />
            </Layout>
          }
        />

        <Route
          path="/faculty-analytics"
          element={
            <Layout role="faculty">
              <FacultyAnalytics />
            </Layout>
          }
        />

        <Route
          path="/faculty-quizzes"
          element={
            <Layout role="faculty">
              <FacultyQuizzes />
            </Layout>
          }
        />

        <Route
          path="/faculty-ai-insights"
          element={
            <Layout role="faculty">
              <FacultyAIInsights />
            </Layout>
          }
        />

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin-dashboard"
          element={
            <Layout role="admin">
              <AdminDashboard />
            </Layout>
          }
        />

        <Route
          path="/admin-students"
          element={
            <Layout role="admin">
              <AdminStudents />
            </Layout>
          }
        />

        <Route
          path="/admin-courses"
          element={
            <Layout role="admin">
              <AdminCourses />
            </Layout>
          }
        />

        {/* =================================================
            COMMON ROUTES
        ================================================= */}

        <Route
          path="/discussion-forum"
          element={
            <Layout>
              <DiscussionForum />
            </Layout>
          }
        />

        <Route
          path="/notifications"
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/404"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;