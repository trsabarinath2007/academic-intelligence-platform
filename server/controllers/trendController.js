const AcademicRecord = require("../models/AcademicRecord");
const Student = require("../models/Student");

// Get Student Performance Trend
const getStudentTrend = async (req, res) => {
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
    }).populate("course", "courseCode courseName credits");

    const gradePoints = {
      "A+": 10,
      A: 9,
      "B+": 8,
      B: 7,
      "C+": 6,
      C: 5,
      D: 4,
      F: 0,
    };

    // Group records by semester
    const semesterData = {};

    records.forEach((record) => {
      const semester = record.semester;

      if (!semesterData[semester]) {
        semesterData[semester] = {
          totalCredits: 0,
          totalPoints: 0,
          subjects: 0,
        };
      }

      if (record.course) {
        const credits = record.course.credits;
        const gradePoint =
          gradePoints[record.grade] || 0;

        semesterData[semester].totalCredits += credits;

        semesterData[semester].totalPoints +=
          gradePoint * credits;

        semesterData[semester].subjects += 1;
      }
    });

    // Create trend
    const trend = Object.keys(semesterData)
      .sort((a, b) => Number(a) - Number(b))
      .map((semester) => {
        const data = semesterData[semester];

        const gpa =
          data.totalCredits > 0
            ? Number(
                (
                  data.totalPoints /
                  data.totalCredits
                ).toFixed(2)
              )
            : 0;

        return {
          semester: Number(semester),
          subjects: data.subjects,
          gpa,
        };
      });

    // Determine trend direction
    let trendDirection = "Stable";

    if (trend.length >= 2) {
      const previousGPA =
        trend[trend.length - 2].gpa;

      const currentGPA =
        trend[trend.length - 1].gpa;

      if (currentGPA > previousGPA) {
        trendDirection = "Improving";
      } else if (currentGPA < previousGPA) {
        trendDirection = "Declining";
      }
    }

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        currentSemester: student.semester,
      },

      trend: {
        direction: trendDirection,
        semesters: trend,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate performance trend",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentTrend,
};