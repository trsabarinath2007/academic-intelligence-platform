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
    <div className="min-h-screen bg-[#f8f7ff]">

      {/* SIDEBAR */}

      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* MAIN AREA */}

      <div className="min-h-screen lg:pl-[255px]">

        {/* TOPBAR */}

        <Topbar
          title={title}
          description={description}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        {/* PAGE CONTENT */}

        <main className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

          <div className="mx-auto w-full max-w-[1450px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Layout;