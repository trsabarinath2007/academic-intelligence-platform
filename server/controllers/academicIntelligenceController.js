const {
  getStudentAcademicIntelligence,
} = require("../services/academicIntelligenceService");

const {
  generateAcademicAIAnalysis,
} = require("../services/academicAIService");

const {
  chatWithStudyAssistant,
} = require("../services/studyAssistantService");

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

const studyAssistantChat =
  async (req, res) => {
    try {
      const {
        message,
        conversation,
      } = req.body;

      if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      if (message.trim().length > 2000) {
        return res.status(400).json({
          success: false,
          message:
            "Message cannot exceed 2000 characters",
        });
      }

      const intelligence =
        await getStudentAcademicIntelligence(
          req.user._id
        );

      const result =
        await chatWithStudyAssistant({
          message,
          conversation,
          intelligence,
        });

      return res.status(200).json({
        success: true,
        reply: result.reply,
        model: result.model,
      });
    } catch (error) {
      console.error(
        "Study Assistant error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get response from Study Assistant",
        error: error.message,
      });
    }
  };

module.exports = {
  getMyAcademicIntelligence,
  getMyAIAnalysis,
  studyAssistantChat,
};