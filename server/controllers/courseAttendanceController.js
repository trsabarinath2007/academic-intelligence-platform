const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Get Course-Wise Attendance
const getCourseAttendance = async (req, res) => {
  try {
    // Find student
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName"
    );

    const courseData = {};

    attendanceRecords.forEach((record) => {
      if (!record.course) {
        return;
      }

      const courseId = record.course._id.toString();

      if (!courseData[courseId]) {
        courseData[courseId] = {
          courseCode: record.course.courseCode,
          courseName: record.course.courseName,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
        };
      }

      courseData[courseId].totalClasses += 1;

      if (record.status === "Present") {
        courseData[courseId].presentClasses += 1;
      } else {
        courseData[courseId].absentClasses += 1;
      }
    });

    const courseAttendance = Object.values(
      courseData
    ).map((course) => {
      const attendancePercentage =
        course.totalClasses > 0
          ? Number(
              (
                (course.presentClasses /
                  course.totalClasses) *
                100
              ).toFixed(2)
            )
          : 0;

      let status;

      if (attendancePercentage >= 85) {
        status = "Excellent";
      } else if (attendancePercentage >= 75) {
        status = "Good";
      } else if (attendancePercentage >= 60) {
        status = "Average";
      } else {
        status = "Critical";
      }

      return {
        ...course,
        attendancePercentage,
        status,
      };
    });

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      courseAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course attendance",
      error: error.message,
    });
  }
};

module.exports = {
  getCourseAttendance,
};