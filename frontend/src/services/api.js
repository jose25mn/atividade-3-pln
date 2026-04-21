const API_BASE_URL = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Falha na requisicao.");
  }

  return response.json();
}

export const api = {
  login: (payload) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getQuestions: () => request("/questions"),
  createQuestion: (payload) =>
    request("/questions", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  evaluate: (payload) =>
    request("/evaluate", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
