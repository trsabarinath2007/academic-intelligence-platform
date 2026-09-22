import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import StudentProfile from "./pages/StudentProfile";
import Courses from "./pages/Courses";
import AcademicRecords from "./pages/AcademicRecords";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;