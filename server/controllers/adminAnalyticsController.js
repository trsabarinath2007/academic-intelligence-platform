const Student = require("../models/Student");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");

// Get Overall Student Performance
const getOverallPerformance = async (req, res) => {
  try {
    const students = await Student.find();

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

    const performance = [];

    for (const student of students) {
      const academicRecords = await AcademicRecord.find({
        student: student._id,
      }).populate("course", "credits");

      const attendanceRecords = await Attendance.find({
        student: student._id,
      });

      const quizAttempts = await QuizAttempt.find({
        student: student._id,
      });

      // GPA
      let totalCredits = 0;
      let totalWeightedPoints = 0;

      academicRecords.forEach((record) => {
        if (record.course) {
          const credits = record.course.credits;
          const gradePoint = gradePoints[record.grade] || 0;

          totalCredits += credits;
          totalWeightedPoints += gradePoint * credits;
        }
      });

      const gpa =
        totalCredits > 0
          ? Number(
              (totalWeightedPoints / totalCredits).toFixed(2)
            )
          : 0;

      // Attendance
      const totalClasses = attendanceRecords.length;

      const presentClasses = attendanceRecords.filter(
        (record) => record.status === "Present"
      ).length;

      const attendancePercentage =
        totalClasses > 0
          ? Number(
              ((presentClasses / totalClasses) * 100).toFixed(2)
            )
          : 0;

      // Quiz average
      let quizAverage = 0;

      if (quizAttempts.length > 0) {
        const totalQuizPercentage = quizAttempts.reduce(
          (sum, attempt) => sum + attempt.percentage,
          0
        );

        quizAverage = Number(
          (totalQuizPercentage / quizAttempts.length).toFixed(2)
        );
      }

      // Performance status
      let status;

      if (gpa >= 9) {
        status = "Excellent";
      } else if (gpa >= 7) {
        status = "Good";
      } else if (gpa >= 5) {
        status = "Average";
      } else {
        status = "Needs Improvement";
      }

      performance.push({
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        gpa,
        attendancePercentage,
        quizAverage,
        status,
      });
    }

   // -------------------------
// Overall Summary
// -------------------------

const totalStudents = performance.length;

const averageGPA =
  totalStudents > 0
    ? Number(
        (
          performance.reduce(
            (sum, student) => sum + student.gpa,
            0
          ) / totalStudents
        ).toFixed(2)
      )
    : 0;

const averageAttendance =
  totalStudents > 0
    ? Number(
        (
          performance.reduce(
            (sum, student) =>
              sum + student.attendancePercentage,
            0
          ) / totalStudents
        ).toFixed(2)
      )
    : 0;

const averageQuizScore =
  totalStudents > 0
    ? Number(
        (
          performance.reduce(
            (sum, student) => sum + student.quizAverage,
            0
          ) / totalStudents
        ).toFixed(2)
      )
    : 0;

const highPerformers = performance.filter(
  (student) => student.gpa >= 9
).length;

const studentsNeedingImprovement = performance.filter(
  (student) =>
    student.gpa < 7 ||
    student.attendancePercentage < 75 ||
    student.quizAverage < 75
).length;

const atRiskStudents = performance.filter(
  (student) =>
    student.gpa < 7 ||
    student.attendancePercentage < 75 ||
    student.quizAverage < 75
);

res.status(200).json({
  success: true,

  summary: {
  totalStudents,
  averageGPA,
  averageAttendance,
  averageQuizScore,
  highPerformers,
  studentsNeedingImprovement,
  atRiskStudents: atRiskStudents.length,
},
  performance,
atRiskStudents,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch overall performance",
      error: error.message,
    });
  }
};

module.exports = {
  getOverallPerformance,
};