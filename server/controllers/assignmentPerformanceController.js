const AssignmentSubmission = require("../models/AssignmentSubmission");
const Student = require("../models/Student");

// Get Assignment Performance
const getAssignmentPerformance = async (req, res) => {
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

    // Get submissions
    const submissions = await AssignmentSubmission.find({
      student: student._id,
    }).populate({
      path: "assignment",
      select: "title description totalMarks dueDate",
      populate: {
        path: "course",
        select: "courseCode courseName",
      },
    });

    const assignmentPerformance = submissions.map(
      (submission) => {
        let performanceLevel = "Not Graded";

        if (submission.marksObtained !== null) {
          const percentage =
            (submission.marksObtained /
              submission.assignment.totalMarks) *
            100;

          if (percentage >= 85) {
            performanceLevel = "Excellent";
          } else if (percentage >= 75) {
            performanceLevel = "Good";
          } else if (percentage >= 60) {
            performanceLevel = "Average";
          } else {
            performanceLevel = "Needs Improvement";
          }
        }

        return {
          assignmentTitle: submission.assignment
            ? submission.assignment.title
            : null,

          courseCode:
            submission.assignment &&
            submission.assignment.course
              ? submission.assignment.course.courseCode
              : null,

          courseName:
            submission.assignment &&
            submission.assignment.course
              ? submission.assignment.course.courseName
              : null,

          totalMarks: submission.assignment
            ? submission.assignment.totalMarks
            : 0,

          marksObtained: submission.marksObtained,

          status: submission.status,

          performanceLevel,

          feedback: submission.feedback,

          submittedAt: submission.submittedAt,

          dueDate: submission.assignment
            ? submission.assignment.dueDate
            : null,
        };
      }
    );

    // Summary
    const totalAssignments =
      assignmentPerformance.length;

    const gradedAssignments =
      assignmentPerformance.filter(
        (assignment) =>
          assignment.marksObtained !== null
      );

    const submittedAssignments =
      assignmentPerformance.filter(
        (assignment) =>
          assignment.status === "Submitted" ||
          assignment.status === "Graded"
      );

    let averagePercentage = 0;

    if (gradedAssignments.length > 0) {
      const totalPercentage =
        gradedAssignments.reduce(
          (sum, assignment) =>
            sum +
            (assignment.marksObtained /
              assignment.totalMarks) *
              100,
          0
        );

      averagePercentage = Number(
        (
          totalPercentage /
          gradedAssignments.length
        ).toFixed(2)
      );
    }

    res.status(200).json({
      success: true,

      student: {
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
      },

      summary: {
        totalAssignments,
        submittedAssignments:
          submittedAssignments.length,
        gradedAssignments:
          gradedAssignments.length,
        averagePercentage,
      },

      assignmentPerformance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch assignment performance",
      error: error.message,
    });
  }
};

module.exports = {
  getAssignmentPerformance,
};