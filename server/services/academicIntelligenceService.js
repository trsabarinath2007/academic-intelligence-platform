const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const QuizAttempt = require("../models/QuizAttempt");
const MaterialProgress = require("../models/MaterialProgress");
const LearningMaterial = require("../models/LearningMaterial");

const clamp = (value, min = 0, max = 100) => {
  return Math.min(
    max,
    Math.max(min, Number(value) || 0)
  );
};

const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const calculateAcademicIntelligence = async (
  student
) => {
  /*
   * =====================================================
   * 1. ATTENDANCE
   * =====================================================
   */

  const attendanceRecords =
    await Attendance.find({
      student: student._id,
    });

  const totalClasses =
    attendanceRecords.length;

  const presentClasses =
    attendanceRecords.filter(
      (record) =>
        record.status === "Present"
    ).length;

  const absentClasses =
    attendanceRecords.filter(
      (record) =>
        record.status === "Absent"
    ).length;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : (presentClasses / totalClasses) *
        100;

  /*
   * =====================================================
   * 2. ASSIGNMENTS
   * =====================================================
   */

  const assignmentSubmissions =
    await AssignmentSubmission.find({
      student: student._id,
    }).populate(
      "assignment",
      "totalMarks dueDate"
    );

  const gradedAssignments =
    assignmentSubmissions.filter(
      (submission) =>
        submission.marksObtained !==
          undefined &&
        submission.marksObtained !==
          null &&
        submission.assignment
    );

  let assignmentPercentage = 0;

  if (gradedAssignments.length > 0) {
    const percentages =
      gradedAssignments.map(
        (submission) => {
          const totalMarks =
            Number(
              submission.assignment
                .totalMarks
            );

          const marksObtained =
            Number(
              submission.marksObtained
            );

          if (
            totalMarks <= 0
          ) {
            return 0;
          }

          return (
            (marksObtained /
              totalMarks) *
            100
          );
        }
      );

    assignmentPercentage =
      percentages.reduce(
        (sum, percentage) =>
          sum + percentage,
        0
      ) / percentages.length;
  }

  /*
   * =====================================================
   * 3. ASSIGNMENT SUBMISSION CONSISTENCY
   * =====================================================
   */

  const totalAssignments =
    assignmentSubmissions.length;

  let onTimeSubmissions = 0;

  assignmentSubmissions.forEach(
    (submission) => {
      if (
        submission.status ===
        "Submitted"
      ) {
        onTimeSubmissions++;
        return;
      }

      if (
        submission.assignment &&
        submission.createdAt &&
        submission.assignment.dueDate
      ) {
        const submittedAt =
          new Date(
            submission.createdAt
          );

        const dueDate =
          new Date(
            submission.assignment
              .dueDate
          );

        if (
          submittedAt <=
          dueDate
        ) {
          onTimeSubmissions++;
        }
      }
    }
  );

  const submissionConsistency =
    totalAssignments === 0
      ? 0
      : (onTimeSubmissions /
          totalAssignments) *
        100;

  /*
   * =====================================================
   * 4. QUIZ PERFORMANCE
   * =====================================================
   */

  const quizAttempts =
    await QuizAttempt.find({
      student: student._id,
    });

  let quizPercentage = 0;

  if (quizAttempts.length > 0) {
    const percentages =
      quizAttempts.map(
        (attempt) => {
          if (
            attempt.percentage !==
              undefined &&
            attempt.percentage !==
              null
          ) {
            return Number(
              attempt.percentage
            );
          }

          const totalMarks =
            Number(
              attempt.totalMarks
            );

          if (
            totalMarks <= 0
          ) {
            return 0;
          }

          return (
            (Number(
              attempt.score || 0
            ) /
              totalMarks) *
            100
          );
        }
      );

    quizPercentage =
      percentages.reduce(
        (sum, percentage) =>
          sum + percentage,
        0
      ) / percentages.length;
  }

  /*
   * =====================================================
   * 5. LEARNING MATERIAL COMPLETION
   * =====================================================
   */

  const totalMaterials =
    await LearningMaterial.countDocuments(
      {
        isPublished: true,
      }
    );

  const materialProgress =
    await MaterialProgress.find({
      student: student._id,
    });

  const completedMaterials =
    materialProgress.filter(
      (progress) =>
        progress.completed === true
    ).length;

  const materialCompletionPercentage =
    totalMaterials === 0
      ? 0
      : (completedMaterials /
          totalMaterials) *
        100;

  /*
   * =====================================================
   * 6. ENGAGEMENT SCORE
   *
   * Attendance       = 30%
   * Material         = 20%
   * Submission       = 20%
   * Quiz participation
   *                  = 30%
   * =====================================================
   */

  const quizParticipationScore =
    quizAttempts.length > 0
      ? clamp(
          Math.min(
            100,
            quizAttempts.length * 20
          )
        )
      : 0;

  const engagementScore = clamp(
    attendancePercentage * 0.3 +
      materialCompletionPercentage *
        0.2 +
      submissionConsistency * 0.2 +
      quizParticipationScore * 0.3
  );

  /*
   * =====================================================
   * 7. ACADEMIC HEALTH SCORE
   *
   * Quiz              = 30%
   * Assignments       = 25%
   * Attendance        = 20%
   * Materials         = 10%
   * Consistency       = 15%
   * =====================================================
   */

  const academicHealthScore =
    clamp(
      quizPercentage * 0.3 +
        assignmentPercentage *
          0.25 +
        attendancePercentage *
          0.2 +
        materialCompletionPercentage *
          0.1 +
        submissionConsistency *
          0.15
    );

  /*
   * =====================================================
   * 8. RISK SCORE
   *
   * Higher risk = lower academic health.
   * =====================================================
   */

  const riskScore = clamp(
    100 - academicHealthScore
  );

  let riskLevel = "Low";

  if (riskScore >= 60) {
    riskLevel = "High";
  } else if (riskScore >= 35) {
    riskLevel = "Medium";
  }

  /*
   * =====================================================
   * 9. RISK FACTORS
   * =====================================================
   */

  const riskFactors = [];

  if (attendancePercentage < 75) {
    riskFactors.push(
      `Low attendance: ${round(
        attendancePercentage,
        1
      )}%`
    );
  }

  if (
    assignmentPercentage < 60 &&
    gradedAssignments.length > 0
  ) {
    riskFactors.push(
      `Low assignment performance: ${round(
        assignmentPercentage,
        1
      )}%`
    );
  }

  if (
    quizPercentage < 60 &&
    quizAttempts.length > 0
  ) {
    riskFactors.push(
      `Low quiz performance: ${round(
        quizPercentage,
        1
      )}%`
    );
  }

  if (
    materialCompletionPercentage <
    50
  ) {
    riskFactors.push(
      `Low learning material completion: ${round(
        materialCompletionPercentage,
        1
      )}%`
    );
  }

  if (
    submissionConsistency < 70 &&
    totalAssignments > 0
  ) {
    riskFactors.push(
      `Inconsistent assignment submission: ${round(
        submissionConsistency,
        1
      )}% on-time`
    );
  }

  /*
   * =====================================================
   * 10. WEAK AREAS
   * =====================================================
   */

  const weakAreas = [];

  if (attendancePercentage < 75) {
    weakAreas.push("Attendance");
  }

  if (
    assignmentPercentage < 60 &&
    gradedAssignments.length > 0
  ) {
    weakAreas.push(
      "Assignment Performance"
    );
  }

  if (
    quizPercentage < 60 &&
    quizAttempts.length > 0
  ) {
    weakAreas.push(
      "Quiz Performance"
    );
  }

  if (
    materialCompletionPercentage <
    50
  ) {
    weakAreas.push(
      "Learning Material Completion"
    );
  }

  if (
    submissionConsistency < 70 &&
    totalAssignments > 0
  ) {
    weakAreas.push(
      "Submission Consistency"
    );
  }

  /*
   * =====================================================
   * 11. PERSONALIZED RECOMMENDATIONS
   * =====================================================
   */

  const recommendations = [];

  if (attendancePercentage < 75) {
    recommendations.push(
      "Improve class attendance and avoid unnecessary absences."
    );
  }

  if (
    assignmentPercentage < 60 &&
    gradedAssignments.length > 0
  ) {
    recommendations.push(
      "Review assignment feedback and practice the topics where marks were lost."
    );
  }

  if (
    quizPercentage < 60 &&
    quizAttempts.length > 0
  ) {
    recommendations.push(
      "Attempt more practice questions and revise concepts before quizzes."
    );
  }

  if (
    materialCompletionPercentage <
    50
  ) {
    recommendations.push(
      "Complete more learning materials before attempting assessments."
    );
  }

  if (
    submissionConsistency < 70 &&
    totalAssignments > 0
  ) {
    recommendations.push(
      "Plan assignment work earlier to improve on-time submission."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain your current academic routine and continue monitoring your performance."
    );
  }

  return {
    student: {
      studentId:
        student.studentId,
      department:
        student.department,
      semester:
        student.semester,
      section:
        student.section,
    },

    metrics: {
      attendance: {
        totalClasses,
        presentClasses,
        absentClasses,
        attendancePercentage:
          round(
            attendancePercentage,
            2
          ),
      },

      assignments: {
        totalSubmitted:
          totalAssignments,
        graded:
          gradedAssignments.length,
        averagePercentage:
          round(
            assignmentPercentage,
            2
          ),
      },

      quizzes: {
        attempted:
          quizAttempts.length,
        averagePercentage:
          round(
            quizPercentage,
            2
          ),
      },

      learningMaterials: {
        totalPublished:
          totalMaterials,
        tracked:
          materialProgress.length,
        completed:
          completedMaterials,
        completionPercentage:
          round(
            materialCompletionPercentage,
            2
          ),
      },

      submissionConsistency: {
        totalAssignments,
        onTime:
          onTimeSubmissions,
        percentage:
          round(
            submissionConsistency,
            2
          ),
      },
    },

    intelligence: {
      engagementScore:
        round(
          engagementScore,
          2
        ),

      academicHealthScore:
        round(
          academicHealthScore,
          2
        ),

      riskScore:
        round(
          riskScore,
          2
        ),

      riskLevel,

      riskFactors,

      weakAreas,

      recommendations,
    },
  };
};

const getStudentAcademicIntelligence =
  async (userId) => {
    const student =
      await Student.findOne({
        user: userId,
      });

    if (!student) {
      throw new Error(
        "Student profile not found"
      );
    }

    return calculateAcademicIntelligence(
      student
    );
  };

module.exports = {
  calculateAcademicIntelligence,
  getStudentAcademicIntelligence,
};