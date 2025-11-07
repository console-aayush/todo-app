import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const API_URL = "https://todo-api-qysgog4bbezdyglej7a8a0oy-3000.thekalkicinematicuniverse.com/todos";

  // Fetch todos from backend
  async function fetchData() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, completed: false }),
    });
    setNewTodo("");
    fetchData();
  };

  // Toggle completed (use PUT)
  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",  // <-- changed to PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchData();
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">📝 Simple Todo App</h1>

      <div className="flex gap-2 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos yet!</p>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center border p-2 rounded bg-white"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <span className={todo.completed ? "line-through text-gray-400" : ""}>
                  {todo.title}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
