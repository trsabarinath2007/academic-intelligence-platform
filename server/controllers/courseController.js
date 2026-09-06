const Course = require("../models/Course");

// Create Course
const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      courseName,
      credits,
      department,
      semester,
    } = req.body;

    // Check required fields
    if (
      !courseCode ||
      !courseName ||
      !credits ||
      !department ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message: "All course fields are required",
      });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({
      courseCode,
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course already exists",
      });
    }

    // Create course
    const course = await Course.create({
      courseCode,
      courseName,
      credits,
      department,
      semester,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};


// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      semester: 1,
      courseCode: 1,
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get courses",
      error: error.message,
    });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
};