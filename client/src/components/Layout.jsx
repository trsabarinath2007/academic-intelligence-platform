import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({
  children,
  role = "student",
  title,
  description,
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}

      <Sidebar role={role} />

      {/* Main Content */}

      <div className="min-h-screen pl-64">

        {/* Topbar */}

        <Topbar
          title={title}
          description={description}
        />

        {/* Content */}

        <main className="w-full px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default Layout;