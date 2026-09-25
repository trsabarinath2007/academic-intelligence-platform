import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  BarChart3,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { logout } from "../api";

const icons = {
  dashboard: LayoutDashboard,
  students: Users,
  courses: BookOpen,
  attendance: CalendarCheck,
  assignments: ClipboardList,
  submissions: FileCheck2,
  analytics: BarChart3,
  profile: Users,
  records: FileText,
  quizzes: ClipboardList,
  insights: BarChart3,
};

const menus = {
  admin: [
    ["Overview", "/admin-dashboard", "dashboard"],
    ["Students", "/admin-students", "students"],
    ["Courses", "/admin-courses", "courses"],
    ["Analytics", "/faculty-analytics", "analytics"],
  ],

  faculty: [
    ["Overview", "/faculty-dashboard", "dashboard"],
    ["Students", "/faculty-students", "students"],
    ["Courses", "/faculty-courses", "courses"],
    ["Learning Materials", "/faculty-learning-materials", "courses"],
    ["Attendance", "/faculty-attendance", "attendance"],
    ["Assignments", "/faculty-assignments", "assignments"],
    ["Submissions", "/faculty-submissions", "submissions"],
    ["Analytics", "/faculty-analytics", "analytics"],
  ],

  student: [
    ["Overview", "/student-dashboard", "dashboard"],
    ["Profile", "/student-profile", "profile"],
    ["Courses", "/student-courses", "courses"],
    ["Academic Records", "/academic-records", "records"],
    ["Attendance", "/attendance", "attendance"],
    ["Quizzes", "/quiz-performance", "quizzes"],
    ["Assignments", "/assignment-performance", "assignments"],
    ["Insights", "/performance-insights", "insights"],
  ],
};

export default function Sidebar({
  role = "student",
  open = false,
  onClose,
}) {
  const location = useLocation();

  const items = menus[role] || menus.student;

  const roleLabel =
    role === "admin"
      ? "Admin Portal"
      : role === "faculty"
      ? "Faculty Portal"
      : "Student Portal";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* Brand */}
        <div className="brand">

          <div className="brand-mark">
            <GraduationCap size={23} />
          </div>

          <div>
            <strong>
              Academic
              <br />
              Intelligence
            </strong>

            <small>{roleLabel}</small>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X size={17} />
          </button>

        </div>

        {/* Section */}
        <div className="sidebar-section-label">
          {role === "admin"
            ? "Administration"
            : role === "faculty"
            ? "Faculty"
            : "Student"}
        </div>

        {/* Navigation */}
        <nav className="side-nav">

          {items.map(([label, path, icon]) => {
            const Icon =
              icons[icon] || LayoutDashboard;

            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <Icon size={18} />

                <span>{label}</span>

                <ChevronRight
                  className="nav-arrow"
                  size={14}
                />
              </NavLink>
            );
          })}

        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">

          <button type="button">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}