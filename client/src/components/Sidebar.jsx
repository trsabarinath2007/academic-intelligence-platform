import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ role = "student" }) {
  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: "▣",
    },
    {
      name: "Profile",
      path: "/student-profile",
      icon: "◉",
    },
    {
      name: "Courses",
      path: "/student-courses",
      icon: "▤",
    },
    {
      name: "Academic Records",
      path: "/academic-records",
      icon: "▥",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "◷",
    },
    {
      name: "Quiz Performance",
      path: "/quiz-performance",
      icon: "✓",
    },
    {
      name: "Assignments",
      path: "/assignment-performance",
      icon: "□",
    },
    {
      name: "Performance Insights",
      path: "/performance-insights",
      icon: "↗",
    },
  ];

  const facultyLinks = [
    {
      name: "Dashboard",
      path: "/faculty-dashboard",
      icon: "▣",
    },
    {
      name: "Students",
      path: "/faculty-students",
      icon: "◉",
    },
    {
      name: "Attendance",
      path: "/faculty-attendance",
      icon: "◷",
    },
    {
      name: "Assignments",
      path: "/faculty-assignments",
      icon: "□",
    },
    {
      name: "Submissions",
      path: "/faculty-submissions",
      icon: "✓",
    },
  ];

  const links =
    role === "faculty"
      ? facultyLinks
      : studentLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-950 text-white">

      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-6">

        <h1 className="text-xl font-bold tracking-tight">
          Academic
          <span className="text-blue-400">
            Intelligence
          </span>
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Academic Management Platform
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        <div className="space-y-1">

          {links.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >

              <span className="flex h-6 w-6 items-center justify-center text-sm">
                {link.icon}
              </span>

              <span>
                {link.name}
              </span>

            </NavLink>

          ))}

        </div>

      </nav>

      {/* Logout */}

      <div className="border-t border-slate-800 p-4">

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >

          <span>
            ⇥
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;