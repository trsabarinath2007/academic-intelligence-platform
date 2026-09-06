const AcademicRecord = require("../models/AcademicRecord");

// Get Student Performance Analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get all academic records for the student
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

    // Grade point mapping
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

      // Find best subject
      if (record.totalMarks > bestRecord.totalMarks) {
        bestRecord = record;
      }

      // Find weakest subject
      if (record.totalMarks < weakestRecord.totalMarks) {
        weakestRecord = record;
      }
    });

    // Calculate GPA
    const gpa = (totalWeightedPoints / totalCredits).toFixed(2);

    // Calculate percentage
    const percentage = ((totalMarks / (records.length * 100)) * 100).toFixed(2);

    // Performance classification
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

module.exports = {
  getStudentAnalytics,
};