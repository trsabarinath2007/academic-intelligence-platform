const chatWithStudyAssistant = async ({
  message,
  conversation = [],
  intelligence,
}) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model =
    process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured in .env"
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
              item.role === "assistant") &&
            typeof item.content === "string" &&
            item.content.trim()
        )
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content.trim(),
        }))
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

Your job is to help students with:
- Academic doubts
- Programming concepts
- Data structures and algorithms
- Database concepts
- Operating systems
- Computer networks
- Software engineering
- Exam preparation
- Study planning
- Understanding mistakes
- Academic performance guidance

Rules:
1. Explain concepts clearly and simply.
2. Give examples when useful.
3. For programming questions, explain the logic before code when appropriate.
4. Never pretend to know information that is not provided.
5. Do not invent academic scores or student data.
6. When academic performance data is provided, use it only as supporting context.
7. Be encouraging but practical.
8. Keep answers focused and readable.
9. For unsafe, illegal, or unrelated requests, politely redirect to academic help.

Student's current academic context:
${academicContext}
`;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...cleanConversation,
    {
      role: "user",
      content: message.trim(),
    },
  ];

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
        messages,
        reasoning_effort: "low",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq Study Assistant error:", data);

    const errorMessage =
      data?.error?.message ||
      "Groq API request failed";

    throw new Error(errorMessage);
  }

  const reply =
    data?.choices?.[0]?.message?.content;

  if (!reply || !reply.trim()) {
    throw new Error(
      "Groq returned an empty response"
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