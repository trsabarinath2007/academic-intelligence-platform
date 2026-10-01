const generateQuizWithAI = async ({
  subject,
  topic,
  difficulty,
  numberOfQuestions,
}) => {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ||
    "http://localhost:11434";

  const model =
    process.env.OLLAMA_MODEL ||
    "gemma3:4b";

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

  const schema = {
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
  };

  const prompt = `
You are an expert educational quiz generator.

Generate exactly ${questionCount} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- Generate exactly ${questionCount} questions.
- Every question must be relevant to the specified topic.
- Each question must have exactly 4 options.
- correctAnswer must be:
  0 = first option
  1 = second option
  2 = third option
  3 = fourth option
- Include a short explanation.
- Include the requested difficulty.
- Include the requested topic.
- Return only valid JSON matching the provided schema.
`;

  const response = await fetch(
    `${baseUrl}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
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
        format: schema,
        options: {
          temperature: 0,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Ollama API error:",
      data
    );

    throw new Error(
      data?.error ||
        "Ollama API request failed"
    );
  }

  const content =
    data?.message?.content;

  if (!content) {
    throw new Error(
      "Ollama returned an empty response"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Invalid Ollama JSON:",
      content
    );

    throw new Error(
      "Ollama returned invalid JSON"
    );
  }

  if (
    !parsed.questions ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Invalid quiz structure returned by Ollama"
    );
  }

  if (
    parsed.questions.length !==
    questionCount
  ) {
    throw new Error(
      `Expected ${questionCount} questions but received ${parsed.questions.length}`
    );
  }

  for (const question of parsed.questions) {
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      !Number.isInteger(
        question.correctAnswer
      ) ||
      question.correctAnswer < 0 ||
      question.correctAnswer > 3
    ) {
      throw new Error(
        "Ollama returned an invalid question format"
      );
    }
  }

  return parsed;
};

module.exports = {
  generateQuizWithAI,
};