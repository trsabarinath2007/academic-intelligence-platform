import React from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";
import { currentUser } from "../api";

export default function Topbar({
  title,
  sidebarOpen,
  onMenu,
}) {
  const user = currentUser();

  const name = user?.name || "User";
  const role = user?.role || "student";

  return (
    <header className="topbar">

      {/* Sidebar menu button */}
      <button
        type="button"
        className="topbar-menu"
        onClick={onMenu}
        aria-label="Open sidebar"
        title="Open sidebar"
      >
        <Menu size={19} />
      </button>

      {/* Page title - mainly visible on smaller screens */}
      <div className="topbar-title">
        <strong>{title}</strong>
        <span>Academic Intelligence</span>
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search students, courses, or analytics..."
        />
      </div>

      {/* Right side */}
      <div className="topbar-right">

        {/* Notification */}
        <button
          type="button"
          className="icon-button notification"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>

        {/* User */}
        <div className="user-menu">

          <div className="avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="user-text">
            <strong>{name}</strong>
            <span>{role}</span>
          </div>

          <ChevronDown size={15} />

        </div>

      </div>
    </header>
  );
}