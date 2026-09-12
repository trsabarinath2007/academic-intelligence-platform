const AcademicRecord = require("../models/AcademicRecord");
const Student = require("../models/Student");

// Get Course-Wise Performance
const getCoursePerformance = async (req, res) => {
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

    // Get academic records
    const records = await AcademicRecord.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName credits"
    );

    const coursePerformance = records.map((record) => {
      let performanceLevel;

      if (record.totalMarks >= 80) {
        performanceLevel = "Excellent";
      } else if (record.totalMarks >= 70) {
        performanceLevel = "Good";
      } else if (record.totalMarks >= 60) {
        performanceLevel = "Average";
      } else {
        performanceLevel = "Needs Improvement";
      }

      return {
        courseCode: record.course
          ? record.course.courseCode
          : null,

        courseName: record.course
          ? record.course.courseName
          : null,

        credits: record.course
          ? record.course.credits
          : 0,

        semester: record.semester,

        internalMarks: record.internalMarks,

        externalMarks: record.externalMarks,

        totalMarks: record.totalMarks,

        grade: record.grade,

        performanceLevel,
      };
    });

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      coursePerformance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course performance",
      error: error.message,
    });
  }
};

module.exports = {
  getCoursePerformance,
};