const {
  getStudentAcademicIntelligence,
} = require("../services/academicIntelligenceService");

const {
  generateAcademicAIAnalysis,
} = require("../services/academicAIService");

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

const getMyAIAnalysis =
  async (req, res) => {
    try {
      const intelligence =
        await getStudentAcademicIntelligence(
          req.user._id
        );

      const analysis =
        await generateAcademicAIAnalysis(
          intelligence
        );

      return res.status(200).json({
        success: true,

        student: intelligence.student,

        metrics: intelligence.metrics,

        intelligence:
          intelligence.intelligence,

        aiAnalysis: analysis,
      });
    } catch (error) {
      console.error(
        "AI academic analysis error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate AI academic analysis",
        error: error.message,
      });
    }
  };

module.exports = {
  getMyAcademicIntelligence,
  getMyAIAnalysis,
};