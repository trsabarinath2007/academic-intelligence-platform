import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to student dashboard
      navigate("/student-dashboard");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Login
        </h1>

        <p className="mb-6 text-gray-500">
          Login to your Academic Intelligence Platform
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="student@example.com"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;