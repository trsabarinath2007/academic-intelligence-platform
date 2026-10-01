import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({
  role = "student",
  isOpen = false,
  onClose,
}) {
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
      path: "/student-courses",
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
      path: "/student-quizzes",
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
    {
      label: "AI Academic Analysis",
      path: "/student-ai-analysis",
      icon: "ai",
    },
    {
      label: "AI Study Assistant",
      path: "/student-study-assistant",
      icon: "ai",
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
      label: "Quizzes",
      path: "/faculty-quizzes",
      icon: "quiz",
    },
    {
      label: "Analytics",
      path: "/faculty-analytics",
      icon: "analytics",
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin-dashboard",
      icon: "dashboard",
    },
    {
      label: "Students",
      path: "/admin-students",
      icon: "students",
    },
    {
      label: "Courses",
      path: "/admin-courses",
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
      label: "Quizzes",
      path: "/faculty-quizzes",
      icon: "quiz",
    },
    {
      label: "Analytics",
      path: "/faculty-analytics",
      icon: "analytics",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "faculty"
      ? facultyLinks
      : studentLinks;

  const portalName =
    role === "admin"
      ? "ADMIN PORTAL"
      : role === "faculty"
      ? "FACULTY PORTAL"
      : "STUDENT PORTAL";

  const sectionName =
    role === "admin"
      ? "Administration"
      : role === "faculty"
      ? "Faculty"
      : "Student";

  const getIcon = (type) => {
    const props = {
      width: 18,
      height: 18,
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
          <svg {...props}>
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1.5"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1.5"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1.5"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1.5"
            />
          </svg>
        );

      case "profile":
        return (
          <svg {...props}>
            <circle
              cx="12"
              cy="8"
              r="3.5"
            />
            <path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5" />
          </svg>
        );

      case "students":
        return (
          <svg {...props}>
            <circle
              cx="9"
              cy="8"
              r="3"
            />
            <path d="M3.5 20c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5" />
            <path d="M16 5.5a3 3 0 0 1 0 5.8" />
            <path d="M17 15c2.1.3 3.4 1.9 3.8 4" />
          </svg>
        );

      case "courses":
        return (
          <svg {...props}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
            <path d="M4 5.5v16" />
            <path d="M8 7h8" />
            <path d="M8 11h7" />
          </svg>
        );

      case "records":
        return (
          <svg {...props}>
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
            />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>
        );

      case "attendance":
        return (
          <svg {...props}>
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
            />
            <path d="M7 3v4" />
            <path d="M17 3v4" />
            <path d="M3 10h18" />
            <path d="m8 15 2 2 5-5" />
          </svg>
        );

      case "quiz":
        return (
          <svg {...props}>
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
            />
            <path d="M8 8h8" />
            <path d="M8 12h2" />
            <path d="M14 12h2" />
            <path d="M8 16h2" />
            <path d="M14 16h2" />
          </svg>
        );

      case "assignment":
        return (
          <svg {...props}>
            <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
            <path d="M9 3v4h6V3" />
            <path d="M8 11h8" />
            <path d="M8 15h6" />
          </svg>
        );

      case "submissions":
        return (
          <svg {...props}>
            <path d="M4 4h16v16H4z" />
            <path d="m8 12 2.5 2.5L16 9" />
          </svg>
        );

      case "analytics":
        return (
          <svg {...props}>
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
          </svg>
        );

      case "ai":
        return (
          <svg {...props}>
            <path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 0 4 4" />
            <path d="M12 3a4 4 0 0 0-4 4v1a4 4 0 0 1-4 4" />
            <path d="M6 12v2a6 6 0 0 0 12 0v-2" />
            <path d="M9 20h6" />
            <path d="M12 17v3" />
            <circle
              cx="9"
              cy="8"
              r="1"
            />
            <circle
              cx="15"
              cy="8"
              r="1"
            />
          </svg>
        );

      case "settings":
        return (
          <svg {...props}>
            <circle
              cx="12"
              cy="12"
              r="3"
            />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z" />
          </svg>
        );

      case "logout":
        return (
          <svg {...props}>
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 4v16" />
          </svg>
        );

      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onClose) {
      onClose();
    }

    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[230px]
          flex-col
          border-r border-[#E7EBF1]
          bg-white
          shadow-[4px_0_20px_rgba(15,23,42,0.05)]
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#EEF1F5] px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#315EFB] text-white shadow-[0_5px_12px_rgba(49,94,251,0.20)]">
              <svg
                width="19"
                height="19"
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

            <div className="min-w-0">
              <h1 className="text-[14px] font-bold leading-[1.05] tracking-[-0.02em] text-[#172033]">
                Academic
                <br />
                Intelligence
              </h1>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#7C5CF6]">
                {portalName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              border border-[#E6EAF0]
              bg-white
              text-[#667085]
              transition
              hover:bg-[#F5F7FB]
              hover:text-[#172033]
              lg:hidden
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#98A2B3]">
            {sectionName}
          </p>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={`${link.path}-${link.label}`}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    group flex min-h-[40px]
                    items-center gap-3
                    rounded-[9px]
                    px-3
                    text-[13px]
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-[#315EFB] text-white shadow-[0_4px_10px_rgba(49,94,251,0.16)]"
                        : "text-[#526071] hover:bg-[#F5F7FB] hover:text-[#172033]"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-[7px]
                        ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-[#718096] group-hover:text-[#315EFB]"
                        }
                      `}
                    >
                      {getIcon(link.icon)}
                    </span>

                    <span className="truncate">
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-[#EEF1F5] px-3 py-3">
          <button
            type="button"
            className="
              flex min-h-[38px]
              w-full
              items-center gap-3
              rounded-[9px]
              px-3
              text-[13px]
              font-medium
              text-[#526071]
              transition
              hover:bg-[#F5F7FB]
              hover:text-[#172033]
            "
          >
            <span className="flex h-7 w-7 items-center justify-center text-[#718096]">
              {getIcon("settings")}
            </span>

            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-1
              flex min-h-[38px]
              w-full
              items-center gap-3
              rounded-[9px]
              px-3
              text-[13px]
              font-medium
              text-[#526071]
              transition
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <span className="flex h-7 w-7 items-center justify-center">
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