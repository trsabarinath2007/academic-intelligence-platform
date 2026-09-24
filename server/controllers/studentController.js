const Student = require("../models/Student");
const User = require("../models/User");
const AcademicRecord = require("../models/AcademicRecord");
const Attendance = require("../models/Attendance");
const QuizAttempt = require("../models/QuizAttempt");

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get all students error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// Get logged-in student's profile
const getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user._id,
    }).populate("user", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
};

// Create student profile
const createStudent = async (req, res) => {
  try {
    const {
      user,
      studentId,
      department,
      semester,
      section,
    } = req.body;

    const existingStudent = await Student.findOne({
      studentId,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists",
      });
    }

    const student = await Student.create({
      user,
      studentId,
      department,
      semester,
      section,
    });

    const populatedStudent = await Student.findById(
      student._id
    ).populate("user", "name email role");

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: populatedStudent,
    });
  } catch (error) {
    console.error("Create student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      studentId,
      department,
      semester,
      section,
    } = req.body;

    student.studentId = studentId ?? student.studentId;
    student.department = department ?? student.department;
    student.semester = semester ?? student.semester;
    student.section = section ?? student.section;

    await student.save();

    const updatedStudent = await Student.findById(
      student._id
    ).populate("user", "name email role");

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// Get student's academic performance
const getStudentAcademicPerformance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const records = await AcademicRecord.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName credits"
    );

    const performance = records.map((record) => ({
      courseCode: record.course?.courseCode,
      courseName: record.course?.courseName,
      credits: record.course?.credits,
      semester: record.semester,
      internalMarks: record.internalMarks,
      externalMarks: record.externalMarks,
      totalMarks: record.totalMarks,
      grade: record.grade,
    }));

    res.status(200).json({
      success: true,
      studentId: student.studentId,
      performance,
    });
  } catch (error) {
    console.error(
      "Get student academic performance error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch academic performance",
      error: error.message,
    });
  }
};

// Get student's attendance
const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const attendance = await Attendance.find({
      student: student._id,
    }).populate(
      "course",
      "courseCode courseName credits"
    );

    const result = attendance.map((record) => ({
      courseCode: record.course?.courseCode,
      courseName: record.course?.courseName,
      status: record.status,
      date: record.date,
    }));

    const totalClasses = result.length;

    const presentClasses = result.filter(
      (record) => record.status === "Present"
    ).length;

    const absentClasses = result.filter(
      (record) => record.status === "Absent"
    ).length;

    const attendancePercentage =
      totalClasses === 0
        ? 0
        : Math.round(
            (presentClasses / totalClasses) * 100
          );

    res.status(200).json({
      success: true,
      studentId: student.studentId,
      summary: {
        totalClasses,
        presentClasses,
        absentClasses,
        attendancePercentage,
      },
      attendance: result,
    });
  } catch (error) {
    console.error(
      "Get student attendance error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};
// Get student's quiz performance
const getStudentQuizPerformance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const attempts = await QuizAttempt.find({
      student: student._id,
    })
      .populate({
        path: "quiz",
        select: "title totalMarks course",
        populate: {
          path: "course",
          select: "courseCode courseName",
        },
      })
      .sort({ createdAt: -1 });

    const quizzes = attempts.map((attempt) => ({
      quizTitle: attempt.quiz?.title,
      courseCode: attempt.quiz?.course?.courseCode,
      courseName: attempt.quiz?.course?.courseName,
      score: attempt.score,
      totalMarks: attempt.quiz?.totalMarks,
      percentage:
        attempt.quiz?.totalMarks > 0
          ? Math.round(
              (attempt.score / attempt.quiz.totalMarks) * 100
            )
          : 0,
      attemptedAt: attempt.createdAt,
    }));

    const averagePercentage =
      quizzes.length === 0
        ? 0
        : Math.round(
            quizzes.reduce(
              (sum, quiz) => sum + quiz.percentage,
              0
            ) / quizzes.length
          );

    res.status(200).json({
      success: true,
      studentId: student.studentId,
      summary: {
        quizzesAttempted: quizzes.length,
        averagePercentage,
      },
      quizzes,
    });
  } catch (error) {
    console.error(
      "Get student quiz performance error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz performance",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getMyStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAcademicPerformance,
  getStudentAttendance,
  getStudentQuizPerformance,
};