const AcademicRecord = require("../models/AcademicRecord");
const Student = require("../models/Student");

// Get Student Performance Analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await AcademicRecord.find({
      student: studentId,
    }).populate("course", "courseCode courseName credits");

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No academic records found for this student",
      });
    }

    let totalCredits = 0;
    let totalWeightedPoints = 0;
    let totalMarks = 0;

    let bestRecord = records[0];
    let weakestRecord = records[0];

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

      if (record.totalMarks > bestRecord.totalMarks) {
        bestRecord = record;
      }

      if (record.totalMarks < weakestRecord.totalMarks) {
        weakestRecord = record;
      }
    });

    const gpa = (totalWeightedPoints / totalCredits).toFixed(2);

    const percentage = (
      (totalMarks / (records.length * 100)) *
      100
    ).toFixed(2);

    let performance;

    if (percentage >= 85) {
      performance = "Excellent";
    } else if (percentage >= 70) {
      performance = "Good";
    } else if (percentage >= 50) {
      performance = "Average";
    } else {
      performance = "Needs Improvement";
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalSubjects: records.length,
        totalCredits,
        gpa: Number(gpa),
        percentage: Number(percentage),
        performance,
        bestSubject: {
          courseCode: bestRecord.course.courseCode,
          courseName: bestRecord.course.courseName,
          marks: bestRecord.totalMarks,
          grade: bestRecord.grade,
        },
        weakestSubject: {
          courseCode: weakestRecord.course.courseCode,
          courseName: weakestRecord.course.courseName,
          marks: weakestRecord.totalMarks,
          grade: weakestRecord.grade,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
};


// Get Complete Student Dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student profile
    const student = await Student.findById(studentId)
      .populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get academic records
    const records = await AcademicRecord.find({
      student: studentId,
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

    // Calculate GPA
    const gpa =
      totalCredits > 0
        ? Number(
            (totalWeightedPoints / totalCredits).toFixed(2)
          )
        : 0;

    // Calculate Percentage
    const percentage =
      records.length > 0
        ? Number(
            (
              (totalMarks / (records.length * 100)) *
              100
            ).toFixed(2)
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
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
};


module.exports = {
  getStudentAnalytics,
  getStudentDashboard,
};