import React from "react";

function Topbar({ title, description }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-6 lg:px-8">

        {/* Page Information */}

        <div>

          <h1 className="text-xl font-bold text-gray-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          {/* Notification */}

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50"
          >
            ♢

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {/* User */}

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs capitalize text-gray-500">
                {user?.role || "User"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;