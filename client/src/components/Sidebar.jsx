import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ role = "student", isOpen, onClose }) {
  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: "▦",
    },
    {
      name: "Profile",
      path: "/student-profile",
      icon: "○",
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
      icon: "▦",
    },
    {
      name: "Students",
      path: "/faculty-students",
      icon: "○",
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
    <>
      {/* Mobile overlay */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[255px] flex-col
          overflow-hidden
          bg-[#11152b]
          text-white
          shadow-[8px_0_30px_rgba(42,35,95,0.08)]
          transition-transform duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================= BRAND ================= */}

        <div className="px-6 pb-6 pt-7">

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-violet-500
                text-lg font-bold
                shadow-lg shadow-violet-500/20
              "
            >
              A
            </div>

            <div className="min-w-0">

              <h1 className="truncate text-[15px] font-bold tracking-tight">
                Academic
                <span className="text-violet-300">
                  Intelligence
                </span>
              </h1>

              <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-500">
                SMART ACADEMIC PLATFORM
              </p>

            </div>

          </div>

        </div>


        {/* ================= NAVIGATION ================= */}

        <div className="px-4">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

        </div>

        <nav className="flex-1 overflow-y-auto px-4">

          <div className="space-y-1.5">

            {links.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3
                  rounded-xl px-3 py-3
                  text-[13px] font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/15"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }
                  `
                }
              >

                {({ isActive }) => (
                  <>
                    {/* Active indicator */}

                    {isActive && (
                      <span className="absolute -left-4 h-7 w-1 rounded-r-full bg-violet-300" />
                    )}

                    <span
                      className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg text-sm
                        transition
                        ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-white/[0.03] text-slate-500 group-hover:text-violet-300"
                        }
                      `}
                    >
                      {link.icon}
                    </span>

                    <span className="truncate">
                      {link.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto text-violet-200">
                        ›
                      </span>
                    )}
                  </>
                )}

              </NavLink>

            ))}

          </div>

        </nav>


        {/* ================= BOTTOM CARD ================= */}

        <div className="p-4">

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3">

            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                ✦
              </div>

              <div>

                <p className="text-xs font-semibold text-white">
                  Academic Insights
                </p>

                <p className="text-[10px] text-slate-500">
                  Stay on track
                </p>

              </div>

            </div>

            <button
              onClick={() => {
                const path =
                  role === "faculty"
                    ? "/faculty-dashboard"
                    : "/performance-insights";

                window.location.href = path;
              }}
              className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              View Insights →
            </button>

          </div>


          {/* Logout */}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
          >

            <span className="flex h-7 w-7 items-center justify-center">
              ⇥
            </span>

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;