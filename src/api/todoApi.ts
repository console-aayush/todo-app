// ✅ Define API base URL at the top
const API_URL = "https://todo-api-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com";

// ✅ Define Todo type
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// ✅ Fetch all todos
export const fetchAllTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos/all`);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};

// ✅ Search todos
export const searchTodos = async (query: string): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search todos");
  return res.json();
};

// ✅ Add a new todo
export const addTodo = async (todo: { title: string; completed?: boolean; category?: string }): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  const data = await res.json();
  return data.todo;
};

// ✅ Update a todo
export const updateTodo = async (id: number, todo: { title: string; completed: boolean; category: string }): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
};

// ✅ Delete a todo
export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
};
