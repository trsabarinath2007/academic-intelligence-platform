import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import StudentProfile from "./pages/StudentProfile";
import Courses from "./pages/Courses";
import AcademicRecords from "./pages/AcademicRecords";
import Attendance from "./pages/Attendance";
import QuizPerformance from "./pages/QuizPerformance";
import AssignmentPerformance from "./pages/AssignmentPerformance";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route path="*" element={<NotFound />} />
        <Route
  path="/student-profile"
  element={<StudentProfile />}
/>
<Route
  path="/student-courses"
  element={<Courses />}
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;