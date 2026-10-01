import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";

function Layout({
  children,
  role,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const currentRole =
    role ||
    storedUser?.role ||
    "student";

  const normalizedRole =
    String(currentRole).toLowerCase();

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth < 768;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const sidebarWidth =
    sidebarCollapsed && !isMobile
      ? 76
      : 240;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* SIDEBAR */}

      <Sidebar
        role={normalizedRole}
        isOpen={sidebarOpen}
        collapsed={
          isMobile
            ? false
            : sidebarCollapsed
        }
        isMobile={isMobile}
        onClose={() =>
          setSidebarOpen(false)
        }
        onToggle={() => {
          if (isMobile) {
            setSidebarOpen(false);
          } else {
            setSidebarCollapsed(
              (previous) =>
                !previous
            );
          }
        }}
      />

      {/* MOBILE HEADER */}

      {isMobile && (
        <div className="sticky top-0 z-30 flex h-14 items-center border-b border-[#E7EBF1] bg-white px-4">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              text-[#334155]
              shadow-sm
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
              />
              <line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
              />
              <line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
              />
            </svg>
          </button>

          <div className="ml-3">
            <p className="text-sm font-bold text-[#172033]">
              Academic Intelligence
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C5CF6]">
              {normalizedRole} portal
            </p>
          </div>

        </div>
      )}

      {/* MAIN */}

      <main
        style={{
          marginLeft: isMobile
            ? 0
            : sidebarWidth,
        }}
        className="
          min-h-screen
          transition-all
          duration-300
        "
      >
        {children}
      </main>

    </div>
  );
}

export default Layout;