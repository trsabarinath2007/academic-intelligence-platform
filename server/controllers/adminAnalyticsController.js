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

    // -------------------------
    // Calculate Student Performance
    // -------------------------

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

      // -------------------------
      // GPA
      // -------------------------

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

      // -------------------------
      // Attendance
      // -------------------------

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

      // -------------------------
      // Quiz Average
      // -------------------------

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

      // -------------------------
      // Performance Status
      // -------------------------

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

    // -------------------------
    // High Performers
    // -------------------------

    const highPerformers = performance.filter(
      (student) => student.gpa >= 9
    ).length;

    // -------------------------
    // Students Needing Improvement
    // -------------------------

    const studentsNeedingImprovement = performance.filter(
      (student) =>
        student.gpa < 7 ||
        student.attendancePercentage < 75 ||
        student.quizAverage < 75
    ).length;

    // -------------------------
    // At-Risk Students
    // -------------------------

    const atRiskStudents = performance.filter(
      (student) =>
        student.gpa < 7 ||
        student.attendancePercentage < 75 ||
        student.quizAverage < 75
    );

    // -------------------------
    // Department-wise Analytics
    // -------------------------

    const departmentData = {};

    performance.forEach((student) => {
      const department = student.department;

      if (!departmentData[department]) {
        departmentData[department] = {
          students: 0,
          totalGPA: 0,
          totalAttendance: 0,
          totalQuizScore: 0,
        };
      }

      departmentData[department].students += 1;

      departmentData[department].totalGPA +=
        student.gpa;

      departmentData[department].totalAttendance +=
        student.attendancePercentage;

      departmentData[department].totalQuizScore +=
        student.quizAverage;
    });

    const departmentAnalytics = Object.keys(
      departmentData
    ).map((department) => {
      const data = departmentData[department];

      return {
        department,
        students: data.students,

        averageGPA: Number(
          (data.totalGPA / data.students).toFixed(2)
        ),

        averageAttendance: Number(
          (
            data.totalAttendance / data.students
          ).toFixed(2)
        ),

        averageQuizScore: Number(
          (
            data.totalQuizScore / data.students
          ).toFixed(2)
        ),
      };
    });

    // -------------------------
    // Final Response
    // -------------------------

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

      departmentAnalytics,
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