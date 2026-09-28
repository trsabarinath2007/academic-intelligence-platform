const generateAcademicAIAnalysis = async (
  intelligence
) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model =
    process.env.GEMINI_MODEL || "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );
  }

  const prompt = `
You are an academic performance advisor.

Analyze the student's academic intelligence data below.

Important rules:
- The numerical metrics calculated by the backend are authoritative.
- Do not invent scores or facts.
- Do not modify the calculated risk level.
- Identify strengths and concerns from the provided data.
- Give practical recommendations.
- Keep recommendations suitable for a college student.

Student:
${JSON.stringify(
  intelligence.student,
  null,
  2
)}

Metrics:
${JSON.stringify(
  intelligence.metrics,
  null,
  2
)}

Academic Intelligence:
${JSON.stringify(
  intelligence.intelligence,
  null,
  2
)}
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
              summary: {
                type: "STRING",
              },
              strengths: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                },
              },
              concerns: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                },
              },
              weakAreas: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                },
              },
              recommendations: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                },
              },
              priorityActions: {
                type: "ARRAY",
                items: {
                  type: "STRING",
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
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Gemini academic analysis error:",
      data
    );

    const message =
      data?.error?.message ||
      "Gemini API request failed";

    throw new Error(message);
  }

  const content =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error(
      "Gemini returned an empty academic analysis"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error(
      "Failed to parse Gemini academic JSON:",
      content
    );

    throw new Error(
      "Gemini returned invalid academic analysis JSON"
    );
  }

  return parsed;
};

module.exports = {
  generateAcademicAIAnalysis,
};