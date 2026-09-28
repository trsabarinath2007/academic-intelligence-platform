import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

function FacultyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);

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
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiRequest("/courses", {
        method: "GET",
      });

      setCourses(response.courses || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load courses");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await apiRequest("/quizzes", {
        method: "GET",
      });

      setQuizzes(response.quizzes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes");
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((prev) =>
      prev.filter((_, index) => index !== questionIndex)
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

        const updatedOptions = [...question.options];

        updatedOptions[optionIndex] = value;

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
              correctAnswer: Number(optionIndex),
            }
          : question
      )
    );
  };

  const resetForm = () => {
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
      },
    ]);
  };

  const handleSubmit = async (e) => {
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
      setError("Add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const currentQuestion = questions[i];

      if (!currentQuestion.question.trim()) {
        setError(
          `Question ${i + 1} cannot be empty`
        );
        return;
      }

      if (
        currentQuestion.options.some(
          (option) => !option.trim()
        )
      ) {
        setError(
          `All options for Question ${i + 1} are required`
        );
        return;
      }

      if (
        currentQuestion.correctAnswer < 0 ||
        currentQuestion.correctAnswer > 3
      ) {
        setError(
          `Select the correct answer for Question ${
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
        description: description.trim(),
        courseId,
        totalMarks: Number(totalMarks),
        duration: Number(duration),

        questions: questions.map((question) => ({
          question: question.question.trim(),

          options: question.options.map((option) =>
            option.trim()
          ),

          // IMPORTANT:
          // Send the option INDEX as a number.
          // 0 = first option
          // 1 = second option
          // 2 = third option
          // 3 = fourth option
          correctAnswer: Number(
            question.correctAnswer
          ),
        })),
      };

      console.log(
        "Quiz payload:",
        payload
      );

      const response = await apiRequest(
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

      resetForm();

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quiz Management
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage quizzes for your courses.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Quizzes
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {quizzes.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {quizzes.reduce(
                (total, quiz) =>
                  total +
                  (quiz.questions?.length || 0),
                0
              )}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Courses
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {courses.length}
            </p>
          </div>

        </div>

        {/* Messages */}
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

        {/* Create Quiz */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Quiz
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add quiz details and multiple-choice questions.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Basic Details */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Quiz Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Example: Data Structures Quiz 2"
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
                    setCourseId(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} -{" "}
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter quiz description"
                  rows="3"
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
                  value={totalMarks}
                  onChange={(e) =>
                    setTotalMarks(e.target.value)
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
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
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

                  <p className="text-sm text-gray-500">
                    Select the correct option using the radio button.
                  </p>
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
                  (question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-6"
                    >

                      {/* Question Header */}
                      <div className="mb-5 flex items-center justify-between">

                        <h4 className="text-lg font-semibold text-gray-900">
                          Question{" "}
                          {questionIndex + 1}
                        </h4>

                        {questions.length > 1 && (
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

                      {/* Question Text */}
                      <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Question
                        </label>

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
                          placeholder="Enter your question"
                          rows="2"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                        />
                      </div>

                      {/* Options */}
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Options
                        </label>

                        <div className="space-y-3">

                          {question.options.map(
                            (
                              option,
                              optionIndex
                            ) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center gap-3 rounded-lg border p-3 ${
                                  Number(
                                    question.correctAnswer
                                  ) ===
                                  optionIndex
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white"
                                }`}
                              >

                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  checked={
                                    Number(
                                      question.correctAnswer
                                    ) ===
                                    optionIndex
                                  }
                                  onChange={() =>
                                    handleCorrectAnswerChange(
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
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      questionIndex,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Option ${
                                    optionIndex + 1
                                  }`}
                                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
                                />

                              </div>
                            )
                          )}

                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                          Select the radio button beside the correct answer.
                        </p>
                      </div>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end gap-3">

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Quiz"}
              </button>

            </div>

          </form>
        </div>

        {/* Existing Quizzes */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Existing Quizzes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quizzes currently available in the system.
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No quizzes created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {quiz.title}
                    </h3>

                    {quiz.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {quiz.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">

                    <p>
                      <span className="font-semibold">
                        Course:
                      </span>{" "}
                      {quiz.course?.courseCode || "N/A"}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Questions:
                      </span>{" "}
                      {quiz.questions?.length || 0}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Marks:
                      </span>{" "}
                      {quiz.totalMarks}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Duration:
                      </span>{" "}
                      {quiz.duration} minutes
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default FacultyQuizzes;