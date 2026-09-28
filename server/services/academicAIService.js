const generateAcademicAIAnalysis = async (
  intelligence
) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model =
    process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured in .env"
    );
  }

  const prompt = `
You are an academic performance advisor.

Analyze the student's academic intelligence data below.

Important:
- The numerical metrics calculated by the backend are authoritative.
- Do not invent scores or facts.
- Give practical and student-friendly recommendations.
- Do not change the calculated risk level.
- Identify strengths, concerns and weak areas from the provided data.

Student:
${JSON.stringify(intelligence.student, null, 2)}

Metrics:
${JSON.stringify(intelligence.metrics, null, 2)}

Academic Intelligence:
${JSON.stringify(
  intelligence.intelligence,
  null,
  2
)}

Return only the structured JSON requested by the schema.
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
              "You are an expert academic performance advisor.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "academic_analysis",
            schema: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                },
                strengths: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                concerns: {
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
                recommendations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                priorityActions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: [
                "summary",
                "strengths",
                "concerns",
                "weakAreas",
                "recommendations",
                "priorityActions",
              ],
              additionalProperties: false,
            },
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Groq academic analysis error:",
      data
    );

    const message =
      data?.error?.message ||
      "Groq API request failed";

    throw new Error(message);
  }

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Groq returned an empty academic analysis"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Failed to parse Groq academic JSON:",
      content
    );

    throw new Error(
      "Groq returned invalid academic analysis JSON"
    );
  }

  return parsed;
};

module.exports = {
  generateAcademicAIAnalysis,
};