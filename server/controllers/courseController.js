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
      courseCode: courseCode.toUpperCase(),
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
    console.error("Create course error:", error);

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
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get courses",
      error: error.message,
    });
  }
};


// Update Course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const {
      courseCode,
      courseName,
      credits,
      department,
      semester,
    } = req.body;

    // Check if another course already uses the new course code
    if (courseCode) {
      const existingCourse = await Course.findOne({
        courseCode: courseCode.toUpperCase(),
        _id: { $ne: req.params.id },
      });

      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: "Course code already exists",
        });
      }

      course.courseCode = courseCode;
    }

    if (courseName !== undefined) {
      course.courseName = courseName;
    }

    if (credits !== undefined) {
      course.credits = credits;
    }

    if (department !== undefined) {
      course.department = department;
    }

    if (semester !== undefined) {
      course.semester = semester;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};


// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
};