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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-slate-950 text-white">

      {/* ================= LOGO ================= */}

      <div className="border-b border-slate-800 px-5 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
            A
          </div>

          <div>

            <h1 className="text-base font-bold tracking-tight">
              Academic
              <span className="text-blue-400">
                Intelligence
              </span>
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Management Platform
            </p>

          </div>

        </div>

      </div>


      {/* ================= NAVIGATION ================= */}

      <nav className="flex-1 overflow-y-auto px-3 py-6">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>

        <div className="space-y-1">

          {links.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >

              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-500 group-hover:text-slate-200"
                    }`}
                  >
                    {link.icon}
                  </span>

                  <span className="truncate">
                    {link.name}
                  </span>
                </>
              )}

            </NavLink>

          ))}

        </div>

      </nav>


      {/* ================= USER / LOGOUT ================= */}

      <div className="border-t border-slate-800 p-3">

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >

          <span className="flex h-7 w-7 items-center justify-center">
            ⇥
          </span>

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;