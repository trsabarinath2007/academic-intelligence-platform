const Student = require("../models/Student");
const AcademicRecord = require("../models/AcademicRecord");

// Get Logged-in Student Dashboard
const getMyDashboard = async (req, res) => {
  try {
    // Find student profile using logged-in user
    const student = await Student.findOne({
      user: req.user._id,
    }).populate("user", "name email role");

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

    let totalCredits = 0;
    let totalWeightedPoints = 0;
    let totalMarks = 0;

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

    records.forEach((record) => {
      const credits = record.course.credits;
      const gradePoint = gradePoints[record.grade] || 0;

      totalCredits += credits;
      totalWeightedPoints += gradePoint * credits;
      totalMarks += record.totalMarks;
    });

    const gpa =
      totalCredits > 0
        ? Number((totalWeightedPoints / totalCredits).toFixed(2))
        : 0;

    const percentage =
      records.length > 0
        ? Number(
            ((totalMarks / (records.length * 100)) * 100).toFixed(2)
          )
        : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        student: {
          id: student._id,
          studentId: student.studentId,
          name: student.user.name,
          email: student.user.email,
          department: student.department,
          semester: student.semester,
          section: student.section,
        },

        summary: {
          totalSubjects: records.length,
          totalCredits,
          gpa,
          percentage,
        },

        subjects: records.map((record) => ({
          courseCode: record.course.courseCode,
          courseName: record.course.courseName,
          credits: record.course.credits,
          internalMarks: record.internalMarks,
          externalMarks: record.externalMarks,
          totalMarks: record.totalMarks,
          grade: record.grade,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getMyDashboard,
};