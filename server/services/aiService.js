const generateQuizWithAI = async ({
  subject,
  topic,
  difficulty,
  numberOfQuestions,
}) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model =
    process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured in .env"
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
- Return only the structured JSON requested by the schema.
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational quiz generator.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "quiz_generation",
            schema: {
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
                        minItems: 4,
                        maxItems: 4,
                      },
                      correctAnswer: {
                        type: "integer",
                        minimum: 0,
                        maximum: 3,
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
                    additionalProperties: false,
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", data);

    const message =
      data?.error?.message ||
      "Groq API request failed";

    throw new Error(message);
  }

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Groq returned an empty response"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Failed to parse Groq JSON:",
      content
    );

    throw new Error(
      "Groq returned invalid JSON"
    );
  }

  if (
    !parsed.questions ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Invalid quiz structure returned by Groq"
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
        "Groq returned an invalid question format"
      );
    }
  }

  return parsed;
};

module.exports = {
  generateQuizWithAI,
};