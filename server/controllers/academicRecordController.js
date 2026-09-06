const AcademicRecord = require("../models/AcademicRecord");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Calculate Grade
const calculateGrade = (total) => {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  return "F";
};

// Create Academic Record
const createAcademicRecord = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      internalMarks,
      externalMarks,
      semester,
    } = req.body;

    // Validate required fields
    if (
      !studentId ||
      !courseId ||
      internalMarks === undefined ||
      externalMarks === undefined ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID, course ID, internal marks, external marks and semester are required",
      });
    }

    // Find student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check duplicate record
    const existingRecord = await AcademicRecord.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Academic record already exists for this student and course",
      });
    }

    // Calculate total and grade
    const totalMarks =
      Number(internalMarks) + Number(externalMarks);

    const grade = calculateGrade(totalMarks);

    // Create record
    const record = await AcademicRecord.create({
      student: studentId,
      course: courseId,
      internalMarks,
      externalMarks,
      totalMarks,
      grade,
      semester,
    });

    res.status(201).json({
      success: true,
      message: "Academic record created successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create academic record",
      error: error.message,
    });
  }
};

// Get All Academic Records
const getAllAcademicRecords = async (req, res) => {
  try {
    const records = await AcademicRecord.find()
      .populate("student")
      .populate("course");

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch academic records",
      error: error.message,
    });
  }
};

module.exports = {
  createAcademicRecord,
  getAllAcademicRecords,
};