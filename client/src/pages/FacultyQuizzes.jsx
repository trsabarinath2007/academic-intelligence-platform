import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

function FacultyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);

  // Manual quiz fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [totalMarks, setTotalMarks] = useState(10);
  const [duration, setDuration] = useState(15);

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: "",
      topic: "",
    },
  ]);

  // AI fields
  const [aiSubject, setAiSubject] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] =
    useState("Medium");
  const [aiQuestionCount, setAiQuestionCount] =
    useState(5);

  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiGenerated, setAiGenerated] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("ai");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiRequest(
        "/courses",
        {
          method: "GET",
        }
      );

      setCourses(response.courses || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load courses"
      );
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await apiRequest(
        "/quizzes",
        {
          method: "GET",
        }
      );

      setQuizzes(response.quizzes || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load quizzes"
      );
    }
  };

  // =====================================================
  // MANUAL QUIZ FUNCTIONS
  // =====================================================

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        difficulty: "",
        topic: "",
      },
    ]);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((prev) =>
      prev.filter(
        (_, index) =>
          index !== questionIndex
      )
    );
  };

  const handleQuestionChange = (
    questionIndex,
    value
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              question: value,
            }
          : question
      )
    );
  };

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const updatedOptions = [
          ...question.options,
        ];

        updatedOptions[optionIndex] =
          value;

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
  };

  const handleCorrectAnswerChange = (
    questionIndex,
    optionIndex
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              correctAnswer:
                Number(optionIndex),
            }
          : question
      )
    );
  };

  const resetManualForm = () => {
    setTitle("");
    setDescription("");
    setCourseId("");
    setTotalMarks(10);
    setDuration(15);

    setQuestions([
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        difficulty: "",
        topic: "",
      },
    ]);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Quiz title is required");
      return;
    }

    if (!courseId) {
      setError("Please select a course");
      return;
    }

    if (questions.length === 0) {
      setError(
        "Add at least one question"
      );
      return;
    }

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {
      const currentQuestion =
        questions[i];

      if (
        !currentQuestion.question.trim()
      ) {
        setError(
          `Question ${i + 1} cannot be empty`
        );
        return;
      }

      if (
        currentQuestion.options.some(
          (option) =>
            !option.trim()
        )
      ) {
        setError(
          `All options for Question ${
            i + 1
          } are required`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description:
          description.trim(),
        courseId,
        totalMarks:
          Number(totalMarks),
        duration: Number(duration),

        questions:
          questions.map(
            (question) => ({
              question:
                question.question.trim(),

              options:
                question.options.map(
                  (option) =>
                    option.trim()
                ),

              correctAnswer:
                Number(
                  question.correctAnswer
                ),
            })
          ),
      };

      const response =
        await apiRequest(
          "/quizzes",
          {
            method: "POST",
            body: payload,
          }
        );

      setMessage(
        response.message ||
          "Quiz created successfully"
      );

      resetManualForm();

      await fetchQuizzes();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to create quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AI QUIZ FUNCTIONS
  // =====================================================

  const generateAIQuiz = async () => {
    setMessage("");
    setError("");

    if (!aiSubject.trim()) {
      setError(
        "Please enter the subject"
      );
      return;
    }

    if (!aiTopic.trim()) {
      setError(
        "Please enter the topic"
      );
      return;
    }

    if (
      Number(aiQuestionCount) < 1 ||
      Number(aiQuestionCount) > 20
    ) {
      setError(
        "Question count must be between 1 and 20"
      );
      return;
    }

    try {
      setAiLoading(true);

      const response =
        await apiRequest(
          "/ai-quizzes/generate",
          {
            method: "POST",
            body: {
              subject:
                aiSubject.trim(),

              topic:
                aiTopic.trim(),

              difficulty:
                aiDifficulty,

              numberOfQuestions:
                Number(
                  aiQuestionCount
                ),
            },
          }
        );

      const generated =
        response.questions || [];

      setAiQuestions(
        generated.map(
          (question) => ({
            question:
              question.question || "",

            options:
              Array.isArray(
                question.options
              )
                ? [
                    ...question.options,
                  ]
                : ["", "", "", ""],

            correctAnswer:
              Number(
                question.correctAnswer
              ),

            explanation:
              question.explanation ||
              "",

            difficulty:
              question.difficulty ||
              aiDifficulty,

            topic:
              question.topic ||
              aiTopic,
          })
        )
      );

      setAiGenerated(true);

      setMessage(
        response.message ||
          "AI quiz generated successfully"
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to generate AI quiz"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const updateAIQuestion = (
    questionIndex,
    field,
    value
  ) => {
    setAiQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const updateAIOption = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setAiQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const updatedOptions = [
          ...question.options,
        ];

        updatedOptions[optionIndex] =
          value;

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
  };

  const updateAICorrectAnswer = (
    questionIndex,
    optionIndex
  ) => {
    setAiQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              correctAnswer:
                Number(optionIndex),
            }
          : question
      )
    );
  };

  const deleteAIQuestion = (
    questionIndex
  ) => {
    setAiQuestions((prev) =>
      prev.filter(
        (_, index) =>
          index !== questionIndex
      )
    );
  };

  const publishAIQuiz = async () => {
    setMessage("");
    setError("");

    if (aiQuestions.length === 0) {
      setError(
        "Generate at least one question before publishing"
      );
      return;
    }

    if (!courseId) {
      setError(
        "Please select a course before publishing"
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Enter a quiz title before publishing"
      );
      return;
    }

    for (
      let i = 0;
      i < aiQuestions.length;
      i++
    ) {
      const question =
        aiQuestions[i];

      if (
        !question.question.trim()
      ) {
        setError(
          `Question ${i + 1} cannot be empty`
        );
        return;
      }

      if (
        question.options.length !== 4
      ) {
        setError(
          `Question ${
            i + 1
          } must have 4 options`
        );
        return;
      }

      if (
        question.options.some(
          (option) =>
            !String(option).trim()
        )
      ) {
        setError(
          `All options for Question ${
            i + 1
          } are required`
        );
        return;
      }

      if (
        Number(
          question.correctAnswer
        ) < 0 ||
        Number(
          question.correctAnswer
        ) > 3
      ) {
        setError(
          `Invalid correct answer for Question ${
            i + 1
          }`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),

        description:
          description.trim() ||
          `AI-generated quiz on ${aiTopic}`,

        courseId,

        totalMarks:
          Number(totalMarks),

        duration: Number(duration),

        questions:
          aiQuestions.map(
            (question) => ({
              question:
                question.question.trim(),

              options:
                question.options.map(
                  (option) =>
                    String(option).trim()
                ),

              correctAnswer:
                Number(
                  question.correctAnswer
                ),
            })
          ),
      };

      const response =
        await apiRequest(
          "/quizzes",
          {
            method: "POST",
            body: payload,
          }
        );

      setMessage(
        response.message ||
          "AI quiz published successfully"
      );

      setAiQuestions([]);
      setAiGenerated(false);

      setTitle("");
      setDescription("");

      await fetchQuizzes();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to publish AI quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quiz Management
          </h1>

          <p className="mt-2 text-gray-600">
            Create quizzes manually or generate them using AI.
          </p>
        </div>

        {/* ================= MESSAGES ================= */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Quizzes
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {quizzes.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Courses
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {courses.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              AI Questions Ready
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {aiQuestions.length}
            </p>
          </div>

        </div>

        {/* ================= TABS ================= */}

        <div className="mb-6 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() =>
              setActiveTab("ai")
            }
            className={`rounded-lg px-5 py-3 font-semibold ${
              activeTab === "ai"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            ✨ AI Quiz Generator
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("manual")
            }
            className={`rounded-lg px-5 py-3 font-semibold ${
              activeTab === "manual"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            Manual Quiz Creation
          </button>

        </div>

        {/* ================================================= */}
        {/* AI GENERATOR */}
        {/* ================================================= */}

        {activeTab === "ai" && (
          <div className="mb-10">

            {/* AI Input */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Quiz Generator
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Generate MCQs with Gemini and review them before publishing.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) =>
                      setAiSubject(
                        e.target.value
                      )
                    }
                    placeholder="Example: Data Structures"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Topic
                  </label>

                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) =>
                      setAiTopic(
                        e.target.value
                      )
                    }
                    placeholder="Example: Binary Trees"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>

                  <select
                    value={aiDifficulty}
                    onChange={(e) =>
                      setAiDifficulty(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="Easy">
                      Easy
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Hard">
                      Hard
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Questions
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={
                      aiQuestionCount
                    }
                    onChange={(e) =>
                      setAiQuestionCount(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={generateAIQuiz}
                  disabled={aiLoading}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading
                    ? "Generating with AI..."
                    : "✨ Generate with AI"}
                </button>
              </div>

            </div>

            {/* AI Review */}
            {aiGenerated && (
              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Review AI Questions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Edit or remove questions before publishing.
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {aiQuestions.length} Questions
                  </span>

                </div>

                {/* Publish Details */}

                <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5">

                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Quiz Details
                  </h3>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Quiz Title
                      </label>

                      <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                          setTitle(
                            e.target.value
                          )
                        }
                        placeholder="Example: Binary Trees AI Quiz"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Course
                      </label>

                      <select
                        value={courseId}
                        onChange={(e) =>
                          setCourseId(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                      >
                        <option value="">
                          Select Course
                        </option>

                        {courses.map(
                          (course) => (
                            <option
                              key={
                                course._id
                              }
                              value={
                                course._id
                              }
                            >
                              {
                                course.courseCode
                              }{" "}
                              -{" "}
                              {
                                course.courseName
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                      </label>

                      <textarea
                        value={
                          description
                        }
                        onChange={(e) =>
                          setDescription(
                            e.target.value
                          )
                        }
                        placeholder="Enter quiz description"
                        rows="3"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Total Marks
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          totalMarks
                        }
                        onChange={(e) =>
                          setTotalMarks(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          duration
                        }
                        onChange={(e) =>
                          setDuration(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                      />
                    </div>

                  </div>

                </div>

                {/* AI Questions */}

                <div className="space-y-6">

                  {aiQuestions.map(
                    (
                      question,
                      questionIndex
                    ) => (
                      <div
                        key={
                          questionIndex
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 p-6"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <h3 className="text-lg font-bold text-gray-900">
                            Question{" "}
                            {questionIndex +
                              1}
                          </h3>

                          <button
                            type="button"
                            onClick={() =>
                              deleteAIQuestion(
                                questionIndex
                              )
                            }
                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </button>

                        </div>

                        <div className="mb-5">

                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Question
                          </label>

                          <textarea
                            value={
                              question.question
                            }
                            onChange={(e) =>
                              updateAIQuestion(
                                questionIndex,
                                "question",
                                e.target.value
                              )
                            }
                            rows="3"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                          />

                        </div>

                        <div className="space-y-3">

                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>

                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => {
                              const selected =
                                Number(
                                  question.correctAnswer
                                ) ===
                                optionIndex;

                              return (
                                <div
                                  key={
                                    optionIndex
                                  }
                                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                                    selected
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >

                                  <input
                                    type="radio"
                                    name={`ai-question-${questionIndex}`}
                                    checked={
                                      selected
                                    }
                                    onChange={() =>
                                      updateAICorrectAnswer(
                                        questionIndex,
                                        optionIndex
                                      )
                                    }
                                    className="h-4 w-4"
                                  />

                                  <span className="w-7 font-semibold text-gray-600">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                    .
                                  </span>

                                  <input
                                    type="text"
                                    value={
                                      option
                                    }
                                    onChange={(e) =>
                                      updateAIOption(
                                        questionIndex,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
                                  />

                                </div>
                              );
                            }
                          )}

                        </div>

                        {/* Explanation */}

                        <div className="mt-5">

                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            AI Explanation
                          </label>

                          <textarea
                            value={
                              question.explanation
                            }
                            onChange={(e) =>
                              updateAIQuestion(
                                questionIndex,
                                "explanation",
                                e.target.value
                              )
                            }
                            rows="3"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                          />

                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {question.difficulty}
                          </span>

                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            {question.topic}
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* Publish */}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => {
                      setAiQuestions([]);
                      setAiGenerated(false);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={publishAIQuiz}
                    disabled={
                      loading ||
                      aiQuestions.length ===
                        0
                    }
                    className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Publishing..."
                      : "Publish AI Quiz"}
                  </button>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* MANUAL QUIZ */}
        {/* ================================================= */}

        {activeTab === "manual" && (
          <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Manual Quiz
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a quiz manually with your own questions.
              </p>
            </div>

            <form onSubmit={handleManualSubmit}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quiz Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="Enter quiz title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course
                  </label>

                  <select
                    value={courseId}
                    onChange={(e) =>
                      setCourseId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={
                            course._id
                          }
                          value={
                            course._id
                          }
                        >
                          {
                            course.courseCode
                          }{" "}
                          -{" "}
                          {
                            course.courseName
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={
                      description
                    }
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows="3"
                    placeholder="Enter description"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      totalMarks
                    }
                    onChange={(e) =>
                      setTotalMarks(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      duration
                    }
                    onChange={(e) =>
                      setDuration(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

              </div>

              {/* Questions */}

              <div className="mt-8">

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Questions
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                  >
                    + Add Question
                  </button>

                </div>

                <div className="space-y-6">

                  {questions.map(
                    (
                      question,
                      questionIndex
                    ) => (
                      <div
                        key={
                          questionIndex
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 p-6"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <h4 className="text-lg font-semibold text-gray-900">
                            Question{" "}
                            {questionIndex +
                              1}
                          </h4>

                          {questions.length >
                            1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeQuestion(
                                  questionIndex
                                )
                              }
                              className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                            >
                              Remove
                            </button>
                          )}

                        </div>

                        <div className="mb-5">

                          <textarea
                            value={
                              question.question
                            }
                            onChange={(e) =>
                              handleQuestionChange(
                                questionIndex,
                                e.target.value
                              )
                            }
                            placeholder="Enter question"
                            rows="2"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                          />

                        </div>

                        <div className="space-y-3">

                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => {

                              const selected =
                                Number(
                                  question.correctAnswer
                                ) ===
                                optionIndex;

                              return (
                                <div
                                  key={
                                    optionIndex
                                  }
                                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                                    selected
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >

                                  <input
                                    type="radio"
                                    name={`manual-${questionIndex}`}
                                    checked={
                                      selected
                                    }
                                    onChange={() =>
                                      handleCorrectAnswerChange(
                                        questionIndex,
                                        optionIndex
                                      )
                                    }
                                    className="h-4 w-4"
                                  />

                                  <span className="font-semibold text-gray-600">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                    .
                                  </span>

                                  <input
                                    type="text"
                                    value={
                                      option
                                    }
                                    onChange={(e) =>
                                      handleOptionChange(
                                        questionIndex,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${
                                      optionIndex +
                                      1
                                    }`}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
                                  />

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    resetManualForm
                  }
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading
                    ? "Creating..."
                    : "Create Quiz"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ================= EXISTING QUIZZES ================= */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Existing Quizzes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quizzes currently available in the system.
            </p>
          </div>

          {quizzes.length ===
          0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No quizzes created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {quizzes.map(
                (quiz) => (
                  <div
                    key={quiz._id}
                    className="rounded-xl border border-gray-200 p-5"
                  >

                    <h3 className="text-lg font-bold text-gray-900">
                      {quiz.title}
                    </h3>

                    {quiz.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {quiz.description}
                      </p>
                    )}

                    <div className="mt-4 space-y-2 text-sm text-gray-600">

                      <p>
                        <span className="font-semibold">
                          Course:
                        </span>{" "}
                        {quiz.course
                          ?.courseCode ||
                          "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Questions:
                        </span>{" "}
                        {
                          quiz.questions
                            ?.length
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Marks:
                        </span>{" "}
                        {
                          quiz.totalMarks
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Duration:
                        </span>{" "}
                        {
                          quiz.duration
                        }{" "}
                        minutes
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default FacultyQuizzes;