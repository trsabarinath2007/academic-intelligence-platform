import React, { useEffect, useRef, useState } from "react";

const StudentStudyAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI Study Assistant. Ask me about programming, DSA, DBMS, OS, Computer Networks, exams, or your study plan.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (customMessage = null) => {
    const message = (
      customMessage !== null ? customMessage : input
    ).trim();

    if (!message || loading) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Your session has expired. Please log in again.",
        },
      ]);
      return;
    }

    const previousConversation = messages
      .filter(
        (item) =>
          item.role === "user" ||
          item.role === "assistant"
      )
      .slice(-8)
      .map((item) => ({
        role:
          item.role === "assistant"
            ? "model"
            : "user",
        content: item.content,
      }));

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/academic-intelligence/student/study-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            conversation: previousConversation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to get response"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error(
        "Study Assistant error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message ||
            "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. What would you like to learn? 📚",
      },
    ]);
  };

  const quickQuestions = [
    "Explain binary search in simple words",
    "Give me a study plan for DSA",
    "What is normalization in DBMS?",
    "Explain recursion with an example",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                AI Learning
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-800">
                AI Study Assistant
              </h1>

              <p className="mt-2 text-gray-500">
                Your personal academic assistant for
                learning and exam preparation.
              </p>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Main Chat */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
                  🤖
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Study Assistant
                  </h2>

                  <p className="text-sm text-gray-500">
                    Powered by Gemini
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                      message.role === "user"
                        ? "rounded-br-md bg-green-600 text-white"
                        : message.error
                        ? "rounded-bl-md bg-red-50 text-red-700"
                        : "rounded-bl-md bg-white text-gray-700 shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{
                          animationDelay: "0.15s",
                        }}
                      ></span>
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{
                          animationDelay: "0.3s",
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 bg-white p-4"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="Ask your academic doubt..."
                  maxLength={2000}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                />

                <button
                  type="submit"
                  disabled={
                    loading || !input.trim()
                  }
                  className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Questions */}
          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Quick Questions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Start with one of these questions.
            </p>

            <div className="mt-4 space-y-3">
              {quickQuestions.map(
                (question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      sendMessage(question)
                    }
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 p-3 text-left text-sm text-gray-700 transition hover:border-green-400 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                )
              )}
            </div>

            <div className="mt-6 rounded-xl bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                You can ask about
              </p>

              <div className="mt-2 space-y-1 text-sm text-green-700">
                <p>• DSA & Programming</p>
                <p>• DBMS</p>
                <p>• Operating Systems</p>
                <p>• Computer Networks</p>
                <p>• Exam Preparation</p>
                <p>• Study Planning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStudyAssistant;