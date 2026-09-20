const Student = require("../models/Student");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");
const AssignmentSubmission = require("../models/AssignmentSubmission");

const getStudentAnalytics = async (req, res) => {
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

    // Fetch data
    const academicRecords = await AcademicRecord.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName credits"
    );

    const attendanceRecords = await Attendance.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName"
    );

    const quizAttempts = await QuizAttempt.find({
      student: student._id,
    }).populate({
      path: "quiz",
      select: "title totalMarks",
      populate: {
        path: "course",
        select: "courseCode courseName",
      },
    });

    const assignmentSubmissions =
      await AssignmentSubmission.find({
        student: student._id,
      }).populate({
        path: "assignment",
        select: "title totalMarks dueDate",
        populate: {
          path: "course",
          select: "courseCode courseName",
        },
      });

    // -------------------------
    // GPA
    // -------------------------

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

    let totalCredits = 0;
    let totalWeightedPoints = 0;

    academicRecords.forEach((record) => {
      if (record.course) {
        const credits = record.course.credits;
        const gradePoint =
          gradePoints[record.grade] || 0;

        totalCredits += credits;
        totalWeightedPoints +=
          gradePoint * credits;
      }
    });

    const gpa =
      totalCredits > 0
        ? Number(
            (
              totalWeightedPoints /
              totalCredits
            ).toFixed(2)
          )
        : 0;

    // -------------------------
    // Attendance
    // -------------------------

    const totalClasses = attendanceRecords.length;

    const presentClasses =
      attendanceRecords.filter(
        (record) =>
          record.status === "Present"
      ).length;

    const attendancePercentage =
      totalClasses > 0
        ? Number(
            (
              (presentClasses /
                totalClasses) *
              100
            ).toFixed(2)
          )
        : 0;

    // -------------------------
    // Quiz Performance
    // -------------------------

    let quizAverage = 0;

    if (quizAttempts.length > 0) {
      const totalQuizPercentage =
        quizAttempts.reduce(
          (sum, attempt) =>
            sum + attempt.percentage,
          0
        );

      quizAverage = Number(
        (
          totalQuizPercentage /
          quizAttempts.length
        ).toFixed(2)
      );
    }

    // -------------------------
    // Assignment Performance
    // -------------------------

    const gradedAssignments =
      assignmentSubmissions.filter(
        (submission) =>
          submission.marksObtained !== null
      );

    let assignmentAverage = 0;

    if (gradedAssignments.length > 0) {
      const totalAssignmentPercentage =
        gradedAssignments.reduce(
          (sum, submission) => {
            if (
              !submission.assignment ||
              !submission.assignment.totalMarks
            ) {
              return sum;
            }

            return (
              sum +
              (submission.marksObtained /
                submission.assignment
                  .totalMarks) *
                100
            );
          },
          0
        );

      assignmentAverage = Number(
        (
          totalAssignmentPercentage /
          gradedAssignments.length
        ).toFixed(2)
      );
    }

    // -------------------------
    // Performance Status
    // -------------------------

    let performanceStatus;

    if (gpa >= 9) {
      performanceStatus = "Excellent";
    } else if (gpa >= 7) {
      performanceStatus = "Good";
    } else if (gpa >= 5) {
      performanceStatus = "Average";
    } else {
      performanceStatus = "Needs Improvement";
    }

    // -------------------------
    // Risk Assessment
    // -------------------------

    let riskScore = 0;
    const riskFactors = [];

    if (gpa < 7) {
      riskScore += 20;
      riskFactors.push(
        "Academic performance needs improvement"
      );
    }

    if (attendancePercentage < 75) {
      riskScore += 20;
      riskFactors.push(
        "Attendance is below 75%"
      );
    }

    if (
      quizAttempts.length > 0 &&
      quizAverage < 75
    ) {
      riskScore += 10;
      riskFactors.push(
        "Quiz performance needs improvement"
      );
    }

    if (
      gradedAssignments.length > 0 &&
      assignmentAverage < 75
    ) {
      riskScore += 10;
      riskFactors.push(
        "Assignment performance needs improvement"
      );
    }

    riskScore = Math.min(
      riskScore,
      100
    );

    let riskLevel;

    if (riskScore >= 60) {
      riskLevel = "High Risk";
    } else if (riskScore >= 30) {
      riskLevel = "Moderate Risk";
    } else {
      riskLevel = "Low Risk";
    }

    // -------------------------
    // Response
    // -------------------------

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      academics: {
        totalSubjects:
          academicRecords.length,
        gpa,
        performanceStatus,
      },

      attendance: {
        totalClasses,
        presentClasses,
        attendancePercentage,
      },

      quizzes: {
        attempted:
          quizAttempts.length,
        averagePercentage:
          quizAverage,
      },

      assignments: {
        total:
          assignmentSubmissions.length,
        graded:
          gradedAssignments.length,
        averagePercentage:
          assignmentAverage,
      },

      riskAssessment: {
        riskLevel,
        riskScore,
        riskFactors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch student analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentAnalytics,
};