const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const generateQuizWithAI = async ({
  subject,
  topic,
  difficulty,
  numberOfQuestions,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const model =
    process.env.GEMINI_MODEL ||
    "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );
  }

  const questionCount =
    Number(numberOfQuestions);

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

Generate exactly ${questionCount} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
1. Exactly ${questionCount} questions.
2. Exactly 4 options per question.
3. Exactly one correct answer.
4. correctAnswer must be an integer.
5. 0 = first option.
6. 1 = second option.
7. 2 = third option.
8. 3 = fourth option.
9. Include a short explanation.
10. Include topic.
11. Include difficulty.
12. Return only valid JSON.
13. No markdown.
`;

  const requestBody = {
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
      responseMimeType:
        "application/json",

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

        required: [
          "questions",
        ],
      },
    },
  };

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const maxRetries = 3;

  let lastError = null;

  for (
    let attempt = 0;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },

        body: JSON.stringify(requestBody),
      });

      const data =
        await response.json();

      if (response.ok) {
        const generatedText =
          data?.candidates?.[0]
            ?.content?.parts?.[0]?.text;

        if (!generatedText) {
          throw new Error(
            "Gemini returned an empty response"
          );
        }

        let parsedResponse;

        try {
          parsedResponse =
            JSON.parse(generatedText);
        } catch (error) {
          throw new Error(
            "Gemini returned invalid JSON"
          );
        }

        if (
          !parsedResponse.questions ||
          !Array.isArray(
            parsedResponse.questions
          )
        ) {
          throw new Error(
            "Invalid quiz response from Gemini"
          );
        }

        if (
          parsedResponse.questions
            .length !== questionCount
        ) {
          throw new Error(
            `Expected ${questionCount} questions but received ${parsedResponse.questions.length}`
          );
        }

        const questions =
          parsedResponse.questions.map(
            (question, index) => {
              if (
                !question.question ||
                typeof question.question !==
                  "string"
              ) {
                throw new Error(
                  `Invalid question ${
                    index + 1
                  }`
                );
              }

              if (
                !Array.isArray(
                  question.options
                ) ||
                question.options.length !== 4
              ) {
                throw new Error(
                  `Question ${
                    index + 1
                  } must contain exactly 4 options`
                );
              }

              const correctAnswer =
                Number(
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
                  `Invalid correct answer in question ${
                    index + 1
                  }`
                );
              }

              return {
                question:
                  question.question.trim(),

                options:
                  question.options.map(
                    (option) =>
                      String(option).trim()
                  ),

                correctAnswer,

                explanation:
                  String(
                    question.explanation ||
                      ""
                  ).trim(),

                difficulty:
                  String(
                    question.difficulty ||
                      difficulty
                  ).trim(),

                topic:
                  String(
                    question.topic ||
                      topic
                  ).trim(),
              };
            }
          );

        return {
          questions,
        };
      }

      const errorMessage =
        data?.error?.message ||
        "Gemini API request failed";

      lastError = new Error(
        errorMessage
      );

      const retryable =
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504;

      if (
        !retryable ||
        attempt === maxRetries
      ) {
        throw lastError;
      }

      const delay =
        2000 *
        Math.pow(2, attempt);

      console.log(
        `Gemini temporarily unavailable. Retrying in ${delay}ms...`
      );

      await sleep(delay);
    } catch (error) {
      lastError = error;

      if (
        attempt === maxRetries
      ) {
        throw lastError;
      }

      const delay =
        2000 *
        Math.pow(2, attempt);

      console.log(
        `Gemini request failed. Retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw (
    lastError ||
    new Error(
      "Gemini API request failed"
    )
  );
};

module.exports = {
  generateQuizWithAI,
};