const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = {
  get: async (path, token) =>
    fetch(`${BASE_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } }),
  post: async (path, body, token) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  del: async (path, token) =>
    fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
};
