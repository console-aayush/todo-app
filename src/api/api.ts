// src/api/api.ts
const API_URL = "https://todo-backend-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com";

export interface UserType {
  id: number;
  username: string;
  email?: string;
}

export interface TodoType {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

// ------------------- Helpers -------------------
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Request failed");
  }
  return res.json();
}

// ------------------- Auth APIs -------------------
export async function signup(data: { username: string; email: string; password: string }): Promise<UserType> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<UserType>(res);
}

export async function login(data: { username: string; password: string }): Promise<UserType> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<UserType>(res);
}

export async function getCurrentUser(): Promise<UserType | null> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
  if (res.status === 401) return null;
  return handleResponse<UserType>(res);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Logout failed");
}

// ------------------- Todos APIs -------------------
export async function fetchTodos(): Promise<TodoType[]> {
  const res = await fetch(`${API_URL}/todos/all`, { credentials: "include" });
  return handleResponse<TodoType[]>(res);
}

export async function addTodo(todo: { title: string }): Promise<TodoType> {
  const res = await fetch(`${API_URL}/todos/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(todo),
  });
  return handleResponse<TodoType>(res);
}

export async function updateTodo(id: number, data: { title?: string; completed?: boolean }): Promise<TodoType> {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<TodoType>(res);
}

export async function toggleTodo(id: number): Promise<TodoType> {
  const res = await fetch(`${API_URL}/todos/${id}/toggle`, { method: "PATCH", credentials: "include" });
  return handleResponse<TodoType>(res);
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete todo");
}
