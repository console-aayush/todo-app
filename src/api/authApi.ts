import { z } from "zod";

const API_URL = "https://todo-api-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com/auth";

// Signup
export const signup = async (data: { username: string; email: string; password: string }) => {
  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const validated = schema.parse(data);

  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Signup failed");
  }

  return res.json();
};

// Login
export const login = async (data: { email: string; password: string }) => {
  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const validated = schema.parse(data);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Invalid credentials");
  }

  return res.json();
};
