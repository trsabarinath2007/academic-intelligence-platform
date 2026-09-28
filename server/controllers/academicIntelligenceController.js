const {
  getStudentAcademicIntelligence,
} = require("../services/academicIntelligenceService");

const getMyAcademicIntelligence =
  async (req, res) => {
    try {
      const intelligence =
        await getStudentAcademicIntelligence(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        intelligence,
      });
    } catch (error) {
      console.error(
        "Academic intelligence error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to calculate academic intelligence",
        error: error.message,
      });
    }
  };

module.exports = {
  getMyAcademicIntelligence,
};