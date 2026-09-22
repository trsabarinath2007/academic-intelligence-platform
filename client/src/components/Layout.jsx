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

      {/* Main Area */}

      <div className="ml-64 min-h-screen">

        {/* Topbar */}

        <Topbar
          title={title}
          description={description}
        />

        {/* Page Content */}

        <main className="p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;