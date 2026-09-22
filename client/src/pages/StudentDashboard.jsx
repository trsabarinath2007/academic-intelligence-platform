{/* ================= QUICK ACTIONS ================= */}
<section className="mb-8">

  <h2 className="mb-5 text-xl font-bold text-gray-800">
    Quick Actions
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

    {/* My Profile */}
    <button
      onClick={() => {
        window.location.href = "/student-profile";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        My Profile
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        View your student profile and personal details.
      </p>
    </button>

    {/* My Courses */}
    <button
      onClick={() => {
        window.location.href = "/student-courses";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        My Courses
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        View your current semester courses.
      </p>
    </button>

    {/* Academic Records */}
    <button
      onClick={() => {
        window.location.href = "/academic-records";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Academic Records
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        View marks, grades and academic records.
      </p>
    </button>

    {/* Attendance */}
    <button
      onClick={() => {
        window.location.href = "/attendance";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Attendance
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Check your course-wise attendance.
      </p>
    </button>

    {/* Quiz Performance */}
    <button
      onClick={() => {
        window.location.href = "/quiz-performance";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Quiz Performance
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        View your quiz scores and performance.
      </p>
    </button>

    {/* Assignment Performance */}
    <button
      onClick={() => {
        window.location.href =
          "/assignment-performance";
      }}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Assignment Performance
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        View assignment scores and faculty feedback.
      </p>
    </button>

  </div>

</section>