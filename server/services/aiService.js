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

  const questionCount = Number(numberOfQuestions);

  if (
    !subject ||
    !topic ||
    !difficulty ||
    !questionCount
  ) {
    throw new Error(
      "Subject, topic, difficulty and number of questions are required"
    );
  }

  if (
    questionCount < 1 ||
    questionCount > 20
  ) {
    throw new Error(
      "Number of questions must be between 1 and 20"
    );
  }

  const prompt = `
You are an expert academic quiz generator.

Generate ${questionCount} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- Generate exactly ${questionCount} questions.
- Every question must have exactly 4 options.
- There must be exactly one correct answer.
- correctAnswer must be a NUMBER:
  0 = first option
  1 = second option
  2 = third option
  3 = fourth option
- Add a short explanation for the correct answer.
- Include the topic.
- Include the difficulty.
- Do not include markdown.
- Return only valid JSON matching the requested schema.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        contents: [
          {
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
            type: "object",

            properties: {
              questions: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    question: {
                      type: "string",
                    },

                    options: {
                      type: "array",

                      items: {
                        type: "string",
                      },
                    },

                    correctAnswer: {
                      type: "integer",
                    },

                    explanation: {
                      type: "string",
                    },

                    difficulty: {
                      type: "string",
                    },

                    topic: {
                      type: "string",
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

        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const apiError =
      data?.error?.message ||
      "Gemini API request failed";

    throw new Error(apiError);
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(
      "Gemini returned invalid JSON"
    );
  }

  if (
    !parsed.questions ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Invalid quiz response from Gemini"
    );
  }

  if (
    parsed.questions.length !==
    questionCount
  ) {
    throw new Error(
      `Gemini returned ${parsed.questions.length} questions instead of ${questionCount}`
    );
  }

  const validatedQuestions =
    parsed.questions.map(
      (question, index) => {
        if (
          !question.question ||
          typeof question.question !==
            "string"
        ) {
          throw new Error(
            `Invalid question at index ${index}`
          );
        }

        if (
          !Array.isArray(question.options) ||
          question.options.length !== 4
        ) {
          throw new Error(
            `Question ${
              index + 1
            } must have exactly 4 options`
          );
        }

        const correctAnswer = Number(
          question.correctAnswer
        );

        if (
          !Number.isInteger(
            correctAnswer
          ) ||
          correctAnswer < 0 ||
          correctAnswer > 3
        ) {
          throw new Error(
            `Invalid correct answer for question ${
              index + 1
            }`
          );
        }

        return {
          question:
            question.question.trim(),

          options: question.options.map(
            (option) =>
              String(option).trim()
          ),

          correctAnswer,

          explanation:
            String(
              question.explanation || ""
            ).trim(),

          difficulty:
            String(
              question.difficulty ||
                difficulty
            ).trim(),

          topic:
            String(
              question.topic || topic
            ).trim(),
        };
      }
    );

  return {
    questions: validatedQuestions,
  };
};

module.exports = {
  generateQuizWithAI,
};