import React from "react";

function Topbar({ title, description, onMenuClick }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName = user?.name || "User";

  const initial = userName
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile menu */}

          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 lg:hidden"
          >
            ☰
          </button>

          <div className="min-w-0">

            <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              {title}
            </h1>

            {description && (
              <p className="hidden truncate text-sm text-gray-500 sm:block">
                {description}
              </p>
            )}

          </div>
        </div>

        {/* Right */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Notification */}

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
          >
            ♢

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* User */}

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 ring-4 ring-blue-50/50">
              {initial}
            </div>

            <div className="hidden sm:block">

              <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                {userName}
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