const {
  generateQuizWithAI,
} = require("../services/aiService");

const generateAIQuiz = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      numberOfQuestions,
    } = req.body;

    if (
      !subject ||
      !topic ||
      !difficulty ||
      !numberOfQuestions
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Subject, topic, difficulty and number of questions are required",
      });
    }

    const result =
      await generateQuizWithAI({
        subject,
        topic,
        difficulty,
        numberOfQuestions,
      });

    return res.status(200).json({
      success: true,
      message:
        "AI quiz generated successfully",
      questions: result.questions,
    });
  } catch (error) {
    console.error(
      "AI quiz generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate AI quiz",
      error: error.message,
    });
  }
};

module.exports = {
  generateAIQuiz,
};