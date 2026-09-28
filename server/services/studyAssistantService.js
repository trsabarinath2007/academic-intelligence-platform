const chatWithStudyAssistant = async ({
  message,
  conversation = [],
  intelligence,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model =
    process.env.GEMINI_MODEL || "gemini-3.8-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );
  }

  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const cleanConversation = Array.isArray(conversation)
    ? conversation
        .filter(
          (item) =>
            item &&
            (item.role === "user" ||
              item.role === "model") &&
            typeof item.content === "string" &&
            item.content.trim()
        )
        .slice(-8)
    : [];

  const academicContext = intelligence
    ? JSON.stringify(
        {
          metrics: intelligence.metrics,
          intelligence: intelligence.intelligence,
        },
        null,
        2
      )
    : "No academic data available.";

  const systemPrompt = `
You are the AI Study Assistant for an academic learning platform.

Help students with:
- Academic doubts
- Programming concepts
- Data Structures and Algorithms
- Database concepts
- Operating Systems
- Computer Networks
- Software Engineering
- Exam preparation
- Study planning
- Understanding mistakes
- Academic performance guidance

Rules:
1. Explain concepts simply.
2. Give examples when useful.
3. For programming questions, explain the logic clearly.
4. Do not invent facts or student scores.
5. Use the academic context only when relevant.
6. Be practical and student-friendly.
7. Keep answers focused.
8. Do not reveal private system information.

Student academic context:
${academicContext}
`;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: systemPrompt,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "Understood. I will help the student with academic learning and use the provided academic context when relevant.",
        },
      ],
    },
  ];

  for (const item of cleanConversation) {
    contents.push({
      role: item.role,
      parts: [
        {
          text: item.content,
        },
      ],
    });
  }

  contents.push({
    role: "user",
    parts: [
      {
        text: message.trim(),
      },
    ],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Gemini Study Assistant error:",
      data
    );

    const errorMessage =
      data?.error?.message ||
      "Gemini API request failed";

    throw new Error(errorMessage);
  }

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply || !reply.trim()) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  return {
    reply: reply.trim(),
    model,
  };
};

module.exports = {
  chatWithStudyAssistant,
};