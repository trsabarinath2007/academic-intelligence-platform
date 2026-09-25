const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const academicRecordRoutes = require("./routes/academicRecordRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const assignmentSubmissionRoutes = require("./routes/assignmentSubmissionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const insightRoutes = require("./routes/insightRoutes");
const riskRoutes = require("./routes/riskRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
const trendRoutes = require("./routes/trendRoutes");
const coursePerformanceRoutes = require("./routes/coursePerformanceRoutes");
const courseAttendanceRoutes = require("./routes/courseAttendanceRoutes");
const quizPerformanceRoutes = require("./routes/quizPerformanceRoutes");
const assignmentPerformanceRoutes = require(
  "./routes/assignmentPerformanceRoutes"
);
const studentAnalyticsRoutes = require(
  "./routes/studentAnalyticsRoutes"
);
const learningMaterialRoutes = require("./routes/learningMaterialRoutes");
const path = require("path");
dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/academic-records", academicRecordRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", assignmentSubmissionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/admin-analytics", adminAnalyticsRoutes);
app.use("/api/trends", trendRoutes);
app.use(
  "/api/course-performance",
  coursePerformanceRoutes
);
app.use(
  "/api/course-attendance",
  courseAttendanceRoutes
);
app.use(
  "/api/quiz-performance",
  quizPerformanceRoutes
);
app.use(
  "/api/assignment-performance",
  assignmentPerformanceRoutes
);
app.use(
  "/api/student-analytics",
  studentAnalyticsRoutes
);
app.use("/api/learning-materials", learningMaterialRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});