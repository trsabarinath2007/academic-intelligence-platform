import React from "react";

function Topbar({ title, description, onMenuClick }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName = user?.name || "Student";

  const initial =
    userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e9e7f5] bg-[#fbfaff]/90 backdrop-blur-xl">

      <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile Menu */}

          <button
            onClick={onMenuClick}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-[#e6e3f3]
              bg-white
              text-[#52516b]
              shadow-sm
              transition
              hover:border-violet-200
              hover:text-violet-600
              lg:hidden
            "
          >
            ☰
          </button>

          <div className="min-w-0">

            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">
              Academic Intelligence
            </p>

            <h1 className="truncate text-xl font-bold tracking-tight text-[#17182b]">
              {title}
            </h1>

            {description && (
              <p className="mt-0.5 hidden truncate text-xs text-[#85849a] sm:block">
                {description}
              </p>
            )}

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Notification */}

          <button
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-[#e6e3f3]
              bg-white
              text-[#66657b]
              shadow-sm
              transition
              hover:border-violet-200
              hover:bg-violet-50
              hover:text-violet-600
            "
          >
            ♢

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>


          <div className="hidden h-8 w-px bg-[#e6e3f3] sm:block" />


          {/* User */}

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-100 text-sm font-bold text-violet-600 ring-4 ring-violet-50">
              {initial}
            </div>

            <div className="hidden sm:block">

              <p className="max-w-[130px] truncate text-xs font-bold text-[#25253a]">
                {userName}
              </p>

              <p className="mt-0.5 text-[10px] capitalize text-[#9290a6]">
                {user?.role || "Student"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;