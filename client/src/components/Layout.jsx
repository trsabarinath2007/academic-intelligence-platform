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

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <Sidebar role={role} />


      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="min-h-screen pl-60">

        {/* ================================================= */}
        {/* TOPBAR */}
        {/* ================================================= */}

        <Topbar
          title={title}
          description={description}
        />


        {/* ================================================= */}
        {/* PAGE CONTENT */}
        {/* ================================================= */}

        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">

          <div className="mx-auto w-full max-w-[1600px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Layout;