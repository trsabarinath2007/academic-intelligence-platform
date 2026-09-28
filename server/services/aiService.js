const generateQuizWithAI = async ({
  subject,
  topic,
  difficulty,
  numberOfQuestions,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model =
    process.env.GEMINI_MODEL || "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );
  }

  if (!subject || !topic || !difficulty) {
    throw new Error(
      "Subject, topic and difficulty are required"
    );
  }

  const questionCount = Number(numberOfQuestions);

  if (
    !Number.isInteger(questionCount) ||
    questionCount < 1 ||
    questionCount > 20
  ) {
    throw new Error(
      "Number of questions must be between 1 and 20"
    );
  }

  const prompt = `
You are an expert educational quiz generator.

Generate exactly ${questionCount} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- Each question must be relevant to the topic.
- Questions must be educational and technically correct.
- Each question must have exactly 4 options.
- correctAnswer must be the numeric index of the correct option:
  0 = first option
  1 = second option
  2 = third option
  3 = fourth option
- Include a short explanation.
- Include difficulty and topic.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              questions: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    question: {
                      type: "STRING",
                    },
                    options: {
                      type: "ARRAY",
                      items: {
                        type: "STRING",
                      },
                    },
                    correctAnswer: {
                      type: "INTEGER",
                    },
                    explanation: {
                      type: "STRING",
                    },
                    difficulty: {
                      type: "STRING",
                    },
                    topic: {
                      type: "STRING",
                    },
                  },
                  required: [
                    "question",
                    "options",
                    "correctAnswer",
                    "explanation",
                    "difficulty",
                    "topic",
                  ],
                },
              },
            },
            required: ["questions"],
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);

    const message =
      data?.error?.message ||
      "Gemini API request failed";

    throw new Error(message);
  }

  const content =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Failed to parse Gemini JSON:",
      content
    );

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }

  if (
    !parsed.questions ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Invalid quiz structure returned by Gemini"
    );
  }

  if (parsed.questions.length !== questionCount) {
    throw new Error(
      `Expected ${questionCount} questions but received ${parsed.questions.length}`
    );
  }

  for (const question of parsed.questions) {
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      !Number.isInteger(question.correctAnswer) ||
      question.correctAnswer < 0 ||
      question.correctAnswer > 3
    ) {
      throw new Error(
        "Gemini returned an invalid question format"
      );
    }
  }

  return parsed;
};

module.exports = {
  generateQuizWithAI,
};