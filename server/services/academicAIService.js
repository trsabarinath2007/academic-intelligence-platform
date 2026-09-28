const generateAcademicAIAnalysis = async (
  intelligence
) => {
  const apiKey =
    process.env.GEMINI_API_KEY;

  const model =
    process.env.GEMINI_MODEL ||
    "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );
  }

  if (!intelligence) {
    throw new Error(
      "Academic intelligence data is required"
    );
  }

  const prompt = `
You are an academic performance analysis assistant.

Your task is to interpret the academic metrics provided below.

IMPORTANT RULES:
- Use ONLY the supplied data.
- Do not invent marks, attendance, subjects, or activities.
- Do not change or recalculate the supplied scores.
- Do not create a different risk score.
- Do not claim facts that are not present in the data.
- Give practical, student-friendly recommendations.
- Keep the analysis concise and actionable.

Student Information:
${JSON.stringify(
  intelligence.student,
  null,
  2
)}

Academic Metrics:
${JSON.stringify(
  intelligence.metrics,
  null,
  2
)}

Calculated Intelligence:
${JSON.stringify(
  intelligence.intelligence,
  null,
  2
)}

Return a structured academic analysis containing:

1. A short overall summary.
2. Academic strengths based only on the data.
3. Academic concerns based only on the data.
4. Weak areas already identified by the analytics engine.
5. Personalized recommendations.
6. Priority actions the student should focus on first.

Do not provide medical, psychological, or unrelated advice.
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
          },
        },
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "Gemini academic analysis error:",
      data
    );

    throw new Error(
      data?.error?.message ||
        "Gemini academic analysis failed"
    );
  }

  const generatedText =
    data?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text;

  if (!generatedText) {
    throw new Error(
      "Gemini returned an empty academic analysis"
    );
  }

  let parsedResponse;

  try {
    parsedResponse =
      JSON.parse(generatedText);
  } catch (error) {
    console.error(
      "Academic AI JSON parse error:",
      generatedText
    );

    throw new Error(
      "Gemini returned invalid academic analysis JSON"
    );
  }

  if (
    !parsedResponse.summary ||
    !Array.isArray(
      parsedResponse.strengths
    ) ||
    !Array.isArray(
      parsedResponse.concerns
    ) ||
    !Array.isArray(
      parsedResponse.weakAreas
    ) ||
    !Array.isArray(
      parsedResponse.recommendations
    ) ||
    !Array.isArray(
      parsedResponse.priorityActions
    )
  ) {
    throw new Error(
      "Invalid academic analysis response from Gemini"
    );
  }

  return {
    summary:
      String(
        parsedResponse.summary
      ).trim(),

    strengths:
      parsedResponse.strengths.map(
        (item) =>
          String(item).trim()
      ),

    concerns:
      parsedResponse.concerns.map(
        (item) =>
          String(item).trim()
      ),

    weakAreas:
      parsedResponse.weakAreas.map(
        (item) =>
          String(item).trim()
      ),

    recommendations:
      parsedResponse.recommendations.map(
        (item) =>
          String(item).trim()
      ),

    priorityActions:
      parsedResponse.priorityActions.map(
        (item) =>
          String(item).trim()
      ),
  };
};

module.exports = {
  generateAcademicAIAnalysis,
};