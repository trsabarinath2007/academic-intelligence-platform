const API_BASE = "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const apiGet = (path) => apiRequest(path);
export const apiPost = (path, body) => apiRequest(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (path, body) => apiRequest(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = (path) => apiRequest(path, { method: "DELETE" });

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}
