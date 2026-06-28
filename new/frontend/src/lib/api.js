const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  signup: (name, email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getTasks: () => request("/tasks"),

  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id, updates) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),

  getHabits: () => request("/habits"),

  createHabit: (habit) =>
    request("/habits", {
      method: "POST",
      body: JSON.stringify(habit),
    }),

  toggleHabit: (id, date) =>
    request(`/habits/${id}/toggle`, {
      method: "PUT",
      body: JSON.stringify({ date }),
    }),

  deleteHabit: (id) =>
    request(`/habits/${id}`, {
      method: "DELETE",
    }),
};