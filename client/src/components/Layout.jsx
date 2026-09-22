import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({
  children,
  role = "student",
  title,
  description,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}

      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}

      <div className="min-h-screen lg:pl-64">

        {/* Topbar */}

        <Topbar
          title={title}
          description={description}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        {/* Content */}

        <main className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}

export default Layout;