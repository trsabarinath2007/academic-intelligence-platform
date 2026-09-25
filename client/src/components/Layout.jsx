import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({
  role = "student",
  title = "Overview",
  children,
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`app ${
        open ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <Sidebar
        role={role}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="main-shell">
        <Topbar
          title={title}
          sidebarOpen={open}
          onMenu={() => setOpen(true)}
        />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}