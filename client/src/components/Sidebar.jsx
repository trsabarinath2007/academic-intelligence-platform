import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role = "student", isOpen, onClose }) {
  const navigate = useNavigate();

  const studentLinks = [
    {
      label: "Dashboard",
      path: "/student-dashboard",
      icon: "dashboard",
    },
    {
      label: "Profile",
      path: "/student-profile",
      icon: "profile",
    },
    {
      label: "Courses",
      path: "/courses",
      icon: "courses",
    },
    {
      label: "Academic Records",
      path: "/academic-records",
      icon: "records",
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: "attendance",
    },
    {
      label: "Quizzes",
      path: "/quiz-performance",
      icon: "quiz",
    },
    {
      label: "Assignments",
      path: "/assignment-performance",
      icon: "assignment",
    },
    {
      label: "Performance Insights",
      path: "/performance-insights",
      icon: "insights",
    },
  ];

  const facultyLinks = [
    {
      label: "Dashboard",
      path: "/faculty-dashboard",
      icon: "dashboard",
    },
    {
      label: "Students",
      path: "/faculty-students",
      icon: "students",
    },
    {
      label: "Courses",
      path: "/faculty-courses",
      icon: "courses",
    },
    {
      label: "Attendance",
      path: "/faculty-attendance",
      icon: "attendance",
    },
    {
      label: "Assignments",
      path: "/faculty-assignments",
      icon: "assignment",
    },
    {
      label: "Submissions",
      path: "/faculty-submissions",
      icon: "submissions",
    },
    {
      label: "Analytics",
      path: "/faculty-dashboard",
      icon: "analytics",
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/faculty-dashboard",
      icon: "dashboard",
    },
    {
      label: "Students",
      path: "/faculty-students",
      icon: "students",
    },
    {
      label: "Courses",
      path: "/faculty-courses",
      icon: "courses",
    },
    {
      label: "Attendance",
      path: "/faculty-attendance",
      icon: "attendance",
    },
    {
      label: "Assignments",
      path: "/faculty-assignments",
      icon: "assignment",
    },
    {
      label: "Submissions",
      path: "/faculty-submissions",
      icon: "submissions",
    },
    {
      label: "Analytics",
      path: "/faculty-dashboard",
      icon: "analytics",
    },
  ];

  const links =
    role === "faculty"
      ? facultyLinks
      : role === "admin"
      ? adminLinks
      : studentLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    if (onClose) {
      onClose();
    }
  };

  const getIcon = (type) => {
    const commonProps = {
      width: 19,
      height: 19,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    switch (type) {
      case "dashboard":
        return (
          <svg {...commonProps}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        );

      case "profile":
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
          </svg>
        );

      case "students":
        return (
          <svg {...commonProps}>
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20c.6-3.2 2.7-5 6-5s5.4 1.8 6 5" />
            <path d="M16 5.5a3 3 0 0 1 0 5.8" />
            <path d="M18 15c1.8.7 2.8 2 3 4" />
          </svg>
        );

      case "courses":
        return (
          <svg {...commonProps}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
            <path d="M4 5.5v15" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
          </svg>
        );

      case "records":
        return (
          <svg {...commonProps}>
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 7h6" />
            <path d="M9 11h6" />
            <path d="M9 15h4" />
          </svg>
        );

      case "attendance":
        return (
          <svg {...commonProps}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4" />
            <path d="M16 3v4" />
            <path d="M3 10h18" />
            <path d="m8 15 2 2 5-5" />
          </svg>
        );

      case "quiz":
        return (
          <svg {...commonProps}>
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8" />
            <path d="M8 12h5" />
            <path d="M8 16h4" />
          </svg>
        );

      case "assignment":
        return (
          <svg {...commonProps}>
            <rect x="4" y="4" width="16" height="17" rx="2" />
            <path d="M9 4V2h6v2" />
            <path d="M8 9h8" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
          </svg>
        );

      case "submissions":
        return (
          <svg {...commonProps}>
            <rect x="4" y="4" width="16" height="17" rx="2" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
            <path d="m15 16 2 2 3-4" />
          </svg>
        );

      case "insights":
        return (
          <svg {...commonProps}>
            <path d="M4 19V9" />
            <path d="M10 19V5" />
            <path d="M16 19v-7" />
            <path d="M22 19H2" />
          </svg>
        );

      case "analytics":
        return (
          <svg {...commonProps}>
            <path d="M4 19V5" />
            <path d="M4 19h17" />
            <path d="m7 15 4-4 3 2 5-6" />
          </svg>
        );

      case "settings":
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L7.3 8.6 9 6.9l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.4h-.1a1.7 1.7 0 0 0-1.6 1z" />
          </svg>
        );

      case "logout":
        return (
          <svg {...commonProps}>
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 4v16" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#172033]/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[255px]
          flex-col border-r border-[#E6EAF0]
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[82px] items-center border-b border-[#EEF1F5] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#315EFB]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
                <path d="M6 12v5c3 2.2 9 2.2 12 0v-5" />
                <path d="M21 10v5" />
              </svg>
            </div>

            <div>
              <h1 className="text-sm font-bold leading-tight text-[#172033]">
                Academic
                <br />
                Intelligence
              </h1>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#98A2B3]">
                {role === "faculty"
                  ? "Faculty Portal"
                  : role === "admin"
                  ? "Admin Portal"
                  : "Student Portal"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">
            {role === "student"
              ? "Student"
              : role === "faculty"
              ? "Faculty"
              : "Administration"}
          </p>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path + link.label}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 rounded-xl px-3 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#EEF3FF] text-[#315EFB]"
                      : "text-[#667085] hover:bg-[#F8FAFC] hover:text-[#172033]"
                  }
                `
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-lg
                        transition-colors
                        ${
                          isActive
                            ? "bg-white text-[#315EFB] shadow-sm"
                            : "text-[#667085] group-hover:text-[#315EFB]"
                        }
                      `}
                    >
                      {getIcon(link.icon)}
                    </span>

                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-[#EEF1F5] p-3">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#172033]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg">
              {getIcon("settings")}
            </span>

            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#667085] transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg">
              {getIcon("logout")}
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;