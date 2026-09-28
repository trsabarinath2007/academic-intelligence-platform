const API_BASE = "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),
  };

  let body = options.body;

  // Convert normal JavaScript objects to JSON.
  // Keep FormData unchanged for file uploads.
  if (
    body &&
    !isFormData &&
    typeof body === "object"
  ) {
    body = JSON.stringify(body);
  }

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers,
      body,
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

// ==========================================
// GET
// ==========================================

export const apiGet = (path) =>
  apiRequest(path, {
    method: "GET",
  });

// ==========================================
// POST
// ==========================================

export const apiPost = (path, body) =>
  apiRequest(path, {
    method: "POST",
    body,
  });

// ==========================================
// PUT
// ==========================================

export const apiPut = (path, body) =>
  apiRequest(path, {
    method: "PUT",
    body,
  });

// ==========================================
// DELETE
// ==========================================

export const apiDelete = (path) =>
  apiRequest(path, {
    method: "DELETE",
  });

// ==========================================
// LOGOUT
// ==========================================

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
}

// ==========================================
// CURRENT USER
// ==========================================

export function currentUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch {
    return {};
  }
}