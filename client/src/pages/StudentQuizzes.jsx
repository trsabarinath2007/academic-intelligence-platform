import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, []);

  useEffect(() => {
    if (!selectedQuiz || timeLeft === null) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmitQuiz(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) {
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuiz, timeLeft]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/quizzes", {
        method: "GET",
      });

      setQuizzes(response.quizzes || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load quizzes"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await apiRequest(
        "/quizzes/my-attempts",
        {
          method: "GET",
        }
      );

      setAttempts(response.attempts || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load quiz attempts"
      );
    }
  };

  const getAttemptForQuiz = (quizId) => {
    return attempts.find(
      (attempt) =>
        attempt.quiz?._id === quizId
    );
  };

  const getPercentage = (attempt) => {
    if (
      attempt?.percentage !== undefined &&
      attempt?.percentage !== null
    ) {
      return Number(attempt.percentage);
    }

    if (
      attempt?.score !== undefined &&
      attempt?.totalMarks
    ) {
      return (
        (Number(attempt.score) /
          Number(attempt.totalMarks)) *
        100
      );
    }

    return 0;
  };

  /*
   * Quiz analytics calculated from completed attempts.
   */
  const quizAnalytics = useMemo(() => {
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        totalMarks: 0,
        averageMarks: 0,
        performanceLevel: "No Data",
      };
    }

    const percentages = attempts.map((attempt) =>
      getPercentage(attempt)
    );

    const totalPercentage = percentages.reduce(
      (sum, value) => sum + value,
      0
    );

    const averagePercentage =
      totalPercentage / percentages.length;

    const highestPercentage = Math.max(
      ...percentages
    );

    const totalMarks = attempts.reduce(
      (sum, attempt) =>
        sum + Number(attempt.score || 0),
      0
    );

    const averageMarks =
      totalMarks / attempts.length;

    let performanceLevel = "Needs Improvement";

    if (averagePercentage >= 85) {
      performanceLevel = "Excellent";
    } else if (averagePercentage >= 70) {
      performanceLevel = "Good";
    } else if (averagePercentage >= 50) {
      performanceLevel = "Average";
    }

    return {
      totalAttempts: attempts.length,
      averagePercentage,
      highestPercentage,
      totalMarks,
      averageMarks,
      performanceLevel,
    };
  }, [attempts]);

  const startQuiz = (quiz) => {
    const existingAttempt =
      getAttemptForQuiz(quiz._id);

    if (existingAttempt) {
      setError(
        "You have already attempted this quiz."
      );
      return;
    }

    setSelectedQuiz(quiz);
    setResult(null);

    setMessage("");
    setError("");

    setAnswers({});

    setTimeLeft(
      Number(quiz.duration || 15) * 60
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeQuiz = () => {
    setSelectedQuiz(null);
    setAnswers({});
    setTimeLeft(null);
    setSubmitting(false);
  };

  const handleAnswerChange = (
    questionIndex,
    optionIndex
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: Number(optionIndex),
    }));
  };

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(
      0,
      seconds || 0
    );

    const minutes = Math.floor(
      safeSeconds / 60
    );

    const remainingSeconds =
      safeSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmitQuiz = async (
    automatic = false
  ) => {
    if (!selectedQuiz || submitting) {
      return;
    }

    const totalQuestions =
      selectedQuiz.questions?.length || 0;

    if (totalQuestions === 0) {
      setError(
        "This quiz has no questions."
      );
      return;
    }

    if (!automatic) {
      const unansweredCount =
        totalQuestions -
        Object.keys(answers).length;

      if (unansweredCount > 0) {
        const shouldSubmit = window.confirm(
          `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`
        );

        if (!shouldSubmit) {
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const formattedAnswers =
        selectedQuiz.questions.map(
          (_, questionIndex) => ({
            questionIndex,
            selectedAnswer:
              answers[questionIndex] !== undefined
                ? Number(
                    answers[questionIndex]
                  )
                : -1,
          })
        );

      const response = await apiRequest(
        "/quizzes/attempt",
        {
          method: "POST",
          body: {
            quizId: selectedQuiz._id,
            answers: formattedAnswers,
          },
        }
      );

      setResult(
        response.attempt ||
          response.result ||
          null
      );

      setMessage(
        automatic
          ? "Time is up. Your quiz was submitted automatically."
          : response.message ||
              "Quiz submitted successfully."
      );

      await fetchAttempts();

      setSelectedQuiz(null);
      setAnswers({});
      setTimeLeft(null);
      setSubmitting(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to submit quiz"
      );

      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            Loading quizzes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quizzes
          </h1>

          <p className="mt-2 text-gray-600">
            Attempt quizzes and track your academic performance.
          </p>
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

        {/* Result */}
        {result && !selectedQuiz && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Latest Quiz Result
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Score
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {result.score} /{" "}
                  {result.totalMarks}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Percentage
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {getPercentage(result).toFixed(
                    1
                  )}
                  %
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  Submitted
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Performance Summary */}
        {!selectedQuiz && (
          <div className="mb-10">

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Quiz Performance Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Summary based on your completed quiz attempts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Attempts
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {quizAnalytics.totalAttempts}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {quizAnalytics.averagePercentage.toFixed(
                    1
                  )}
                  %
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Highest
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {quizAnalytics.highestPercentage.toFixed(
                    1
                  )}
                  %
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average Marks
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {quizAnalytics.averageMarks.toFixed(
                    1
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Performance
                </p>

                <p className="mt-2 text-xl font-bold text-green-600">
                  {quizAnalytics.performanceLevel}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Active Quiz */}
        {selectedQuiz ? (
          <div className="mb-10">

            {/* Quiz Header */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedQuiz.title}
                  </h2>

                  <p className="mt-1 text-gray-500">
                    {selectedQuiz.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">

                    <span>
                      Course:{" "}
                      <strong>
                        {selectedQuiz.course?.courseCode ||
                          "N/A"}
                      </strong>
                    </span>

                    <span>
                      Questions:{" "}
                      <strong>
                        {selectedQuiz.questions?.length ||
                          0}
                      </strong>
                    </span>

                    <span>
                      Marks:{" "}
                      <strong>
                        {selectedQuiz.totalMarks}
                      </strong>
                    </span>

                  </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center">

                  <p className="text-sm font-medium text-red-600">
                    Time Remaining
                  </p>

                  <p className="mt-1 text-3xl font-bold text-red-700">
                    {formatTime(timeLeft)}
                  </p>

                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">

              {selectedQuiz.questions?.map(
                (question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >

                    <div className="mb-5">
                      <p className="text-lg font-semibold text-gray-900">
                        {questionIndex + 1}.{" "}
                        {question.question}
                      </p>
                    </div>

                    <div className="space-y-3">

                      {question.options?.map(
                        (option, optionIndex) => {
                          const selected =
                            Number(
                              answers[
                                questionIndex
                              ]
                            ) === optionIndex;

                          return (
                            <label
                              key={optionIndex}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                                selected
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >

                              <input
                                type="radio"
                                name={`question-${questionIndex}`}
                                value={optionIndex}
                                checked={selected}
                                onChange={() =>
                                  handleAnswerChange(
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

                              <span className="text-gray-800">
                                {option}
                              </span>

                            </label>
                          );
                        }
                      )}

                    </div>
                  </div>
                )
              )}

            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeQuiz}
                disabled={submitting}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Exit Quiz
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSubmitQuiz(false)
                }
                disabled={submitting}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Quiz"}
              </button>

            </div>
          </div>
        ) : (
          <>
            {/* Available Quizzes */}
            <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Quizzes
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select a quiz to begin your attempt.
                </p>
              </div>

              {quizzes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  No quizzes are available.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                  {quizzes.map((quiz) => {
                    const attempt =
                      getAttemptForQuiz(
                        quiz._id
                      );

                    return (
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
                            {quiz.course?.courseCode ||
                              "N/A"}
                          </p>

                          <p>
                            <span className="font-semibold">
                              Questions:
                            </span>{" "}
                            {quiz.questions?.length ||
                              0}
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

                        {attempt ? (
                          <div className="mt-5 rounded-lg bg-green-50 p-4">

                            <p className="font-semibold text-green-700">
                              Already Attempted
                            </p>

                            <p className="mt-1 text-sm text-green-600">
                              Score:{" "}
                              {attempt.score} /{" "}
                              {attempt.totalMarks}
                            </p>

                            <p className="text-sm text-green-600">
                              Percentage:{" "}
                              {getPercentage(
                                attempt
                              ).toFixed(1)}
                              %
                            </p>

                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              startQuiz(quiz)
                            }
                            className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                          >
                            Start Quiz
                          </button>
                        )}

                      </div>
                    );
                  })}

                </div>
              )}
            </div>

            {/* Previous Attempts */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Quiz Attempts
                </h2>
              </div>

              {attempts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  You have not attempted any quizzes yet.
                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">

                        <th className="px-4 py-3">
                          Quiz
                        </th>

                        <th className="px-4 py-3">
                          Course
                        </th>

                        <th className="px-4 py-3">
                          Score
                        </th>

                        <th className="px-4 py-3">
                          Percentage
                        </th>

                        <th className="px-4 py-3">
                          Performance
                        </th>

                        <th className="px-4 py-3">
                          Attempted At
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {attempts.map((attempt) => {
                        const percentage =
                          getPercentage(attempt);

                        let level =
                          "Needs Improvement";

                        if (percentage >= 85) {
                          level = "Excellent";
                        } else if (percentage >= 70) {
                          level = "Good";
                        } else if (percentage >= 50) {
                          level = "Average";
                        }

                        return (
                          <tr
                            key={attempt._id}
                            className="border-b border-gray-100"
                          >

                            <td className="px-4 py-4 font-medium text-gray-900">
                              {attempt.quiz?.title ||
                                "Quiz"}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {attempt.quiz?.course
                                ?.courseCode ||
                                "N/A"}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {attempt.score} /{" "}
                              {attempt.totalMarks}
                            </td>

                            <td className="px-4 py-4 font-semibold text-gray-900">
                              {percentage.toFixed(
                                1
                              )}
                              %
                            </td>

                            <td className="px-4 py-4 font-medium text-green-600">
                              {level}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {attempt.attemptedAt
                                ? new Date(
                                    attempt.attemptedAt
                                  ).toLocaleString()
                                : "N/A"}
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentQuizzes;