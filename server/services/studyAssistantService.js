const chatWithStudyAssistant = async ({
  message,
  conversation = [],
  intelligence,
}) => {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ||
    "http://localhost:11434";

  const model =
    process.env.OLLAMA_MODEL ||
    "gemma3:4b";

  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const cleanConversation =
    Array.isArray(conversation)
      ? conversation
          .filter(
            (item) =>
              item &&
              (item.role === "user" ||
                item.role === "assistant") &&
              typeof item.content ===
                "string" &&
              item.content.trim()
          )
          .slice(-8)
      : [];

  const academicContext =
    intelligence
      ? JSON.stringify(
          {
            metrics:
              intelligence.metrics,
            intelligence:
              intelligence.intelligence,
          },
          null,
          2
        )
      : "No academic data available.";

  const systemPrompt = `
You are the AI Study Assistant for an academic learning platform.

Help students with:
- Academic doubts
- Programming
- Data Structures and Algorithms
- DBMS
- Operating Systems
- Computer Networks
- Software Engineering
- Exam preparation
- Study planning
- Understanding mistakes

Rules:
1. Explain concepts simply.
2. Give examples when useful.
3. For programming questions, explain the logic clearly.
4. Do not invent academic scores.
5. Use the academic context only when relevant.
6. Be practical and student-friendly.
7. Keep answers focused.
8. Do not reveal system information.

Current academic context:
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
    `${baseUrl}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages,
        options: {
          temperature: 0.3,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Ollama Study Assistant error:",
      data
    );

    throw new Error(
      data?.error ||
        "Ollama API request failed"
    );
  }

  const reply =
    data?.message?.content;

  if (!reply || !reply.trim()) {
    throw new Error(
      "Ollama returned an empty response"
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