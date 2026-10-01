const generateFacultyAIInsights = async (
  analytics
) => {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ||
    "http://localhost:11434";

  const model =
    process.env.OLLAMA_MODEL ||
    "gemma3:4b";

  const schema = {
    type: "object",
    properties: {
      summary: {
        type: "string",
      },
      keyConcerns: {
        type: "array",
        items: {
          type: "string",
        },
      },
      weakAreas: {
        type: "array",
        items: {
          type: "string",
        },
      },
      suggestedFacultyActions: {
        type: "array",
        items: {
          type: "string",
        },
      },
      teachingImprovementRecommendations: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: [
      "summary",
      "keyConcerns",
      "weakAreas",
      "suggestedFacultyActions",
      "teachingImprovementRecommendations",
    ],
    additionalProperties: false,
  };

  const prompt = `
You are an AI academic analytics assistant for faculty.

Analyze the following backend-calculated class performance data.

The data contains:
- Overall student statistics
- GPA/performance data
- Attendance
- Quiz performance
- Students needing improvement
- At-risk students
- Department analytics

IMPORTANT:
- The provided numerical data is authoritative.
- Do not invent students, scores, departments or statistics.
- Do not change any provided numerical values.
- Do not create unsupported conclusions.
- Identify patterns visible in the supplied data.
- Provide practical faculty actions.
- Keep recommendations concise and useful.
- Return only JSON matching the schema.

CLASS ANALYTICS:
${JSON.stringify(analytics, null, 2)}
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
              "You are an expert academic analytics assistant for college faculty.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        format: schema,
        options: {
          temperature: 0.2,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Ollama faculty AI error:",
      data
    );

    throw new Error(
      data?.error ||
        "Ollama faculty AI request failed"
    );
  }

  const content =
    data?.message?.content;

  if (!content) {
    throw new Error(
      "Ollama returned an empty faculty analysis"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Invalid faculty AI JSON:",
      content
    );

    throw new Error(
      "Ollama returned invalid faculty analysis JSON"
    );
  }

  return {
    ...parsed,
    model,
  };
};

module.exports = {
  generateFacultyAIInsights,
};