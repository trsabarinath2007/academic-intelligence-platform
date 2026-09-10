const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");
const Student = require("../models/Student");

// Get Student Risk Prediction
const getStudentRisk = async (req, res) => {
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

    // Fetch academic records
    const academicRecords = await AcademicRecord.find({
      student: student._id,
    });

    // Fetch attendance
    const attendanceRecords = await Attendance.find({
      student: student._id,
    });

    // Fetch quiz attempts
    const quizAttempts = await QuizAttempt.find({
      student: student._id,
    });

    // -------------------------
    // Calculate GPA
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

    // AcademicRecord must contain course credits
    // If course information is not available,
    // GPA will remain 0.
    const recordsWithCourses = await AcademicRecord.find({
      student: student._id,
    }).populate("course", "credits");

    recordsWithCourses.forEach((record) => {
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
    // Calculate Attendance
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
    // Calculate Quiz Average
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
    // Risk Calculation
    // -------------------------

    let riskScore = 0;
    const riskFactors = [];

    // Low GPA
    if (gpa < 5) {
      riskScore += 40;
      riskFactors.push("Very low academic performance");
    } else if (gpa < 7) {
      riskScore += 20;
      riskFactors.push("Below-average academic performance");
    }

    // Low attendance
    if (attendancePercentage < 60) {
      riskScore += 30;
      riskFactors.push("Very low attendance");
    } else if (attendancePercentage < 75) {
      riskScore += 20;
      riskFactors.push("Attendance below 75%");
    }

    // Low quiz performance
    if (quizAttempts.length > 0 && quizAverage < 60) {
      riskScore += 20;
      riskFactors.push("Low quiz performance");
    } else if (quizAttempts.length > 0 && quizAverage < 75) {
      riskScore += 10;
      riskFactors.push("Quiz performance needs improvement");
    }

    // Low marks in subjects
    const lowMarkSubjects = academicRecords.filter(
      (record) => record.totalMarks < 70
    ).length;

    if (lowMarkSubjects >= 2) {
      riskScore += 20;
      riskFactors.push(
        "Low marks in multiple subjects"
      );
    } else if (lowMarkSubjects === 1) {
      riskScore += 10;
      riskFactors.push(
        "Low marks in one subject"
      );
    }

    // Maximum risk score = 100
    riskScore = Math.min(riskScore, 100);

    // -------------------------
    // Determine Risk Level
    // -------------------------

    let riskLevel;

    if (riskScore >= 60) {
      riskLevel = "High Risk";
    } else if (riskScore >= 30) {
      riskLevel = "Moderate Risk";
    } else {
      riskLevel = "Low Risk";
    }

    // -------------------------
    // Recommendations
    // -------------------------

    const recommendations = [];

    if (attendancePercentage < 75) {
      recommendations.push(
        "Improve attendance and maintain at least 75%."
      );
    }

    if (gpa < 7) {
      recommendations.push(
        "Focus more study time on subjects with lower marks."
      );
    }

    if (quizAttempts.length > 0 && quizAverage < 75) {
      recommendations.push(
        "Practice more quiz questions regularly."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain your current academic performance."
      );
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

      riskAssessment: {
        riskLevel,
        riskScore,
        riskFactors,
      },

      performance: {
        gpa,
        attendancePercentage,
        quizAverage,
        lowMarkSubjects,
      },

      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate student risk",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentRisk,
};