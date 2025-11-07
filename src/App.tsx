import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  category?: string;
  createdAt?: string;
  completedAt?: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [category, setCategory] = useState("General");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCategory, setEditingCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = "https://todo-api-qysgog4bbezdyglej7a8a0oy-3000.thekalkicinematicuniverse.com/todos"; // change to deployed URL if needed

  // Fetch todos
  const fetchData = async (searchTerm = "") => {
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Backend did not return an array", data);
        setTodos([]);
        return;
      }

      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };


  useEffect(() => {
    fetchData(search);
  }, [search]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, completed: false, category }),
    });
    setNewTodo("");
    setCategory("General");
    fetchData(search);
  };

  const toggleTodo = async (id: number, completed: boolean, title: string, category: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: !completed, category }),
    });
    fetchData(search);
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchData(search);
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingCategory(todo.category || "General");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingCategory("General");
  };

  const saveEdit = async (id: number, completed: boolean) => {
    if (!editingTitle.trim()) return;
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editingTitle,
        completed,
        category: editingCategory,
      }),
    });
    cancelEdit();
    fetchData(search);
  };

  const visibleTodos = todos.filter(todo =>
    filter === "All" || (filter === "Completed" ? todo.completed : !todo.completed)
  );

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-white";
  const buttonHoverClass = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-300";

  return (
    <div className={`min-h-screen flex flex-col items-center pt-10 px-4 ${bgClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold">📝 Todo App</h1>
        <button onClick={toggleDarkMode} className={`px-3 py-1 border rounded ${buttonHoverClass}`}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Shopping</option>
        </select>
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
          Add
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as "All" | "Completed" | "Pending")} className="border p-2 rounded">
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Todo List */}
      <ul className="w-full max-w-md space-y-2">
        {visibleTodos.length === 0 ? (
          <p className="text-gray-500 text-center">No todos found!</p>
        ) : (
          visibleTodos.map((todo) => (
            <li key={todo.id} className={`flex justify-between items-center border p-2 rounded ${cardBgClass}`}>
              {editingId === todo.id ? (
                <div className="flex flex-col w-full gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <select
                    value={editingCategory}
                    onChange={(e) => setEditingCategory(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option>General</option>
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Shopping</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(todo.id, todo.completed)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Save
                    </button>
                    <button onClick={cancelEdit} className={`px-3 py-1 rounded ${buttonHoverClass}`}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col flex-1 gap-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id, todo.completed, todo.title, todo.category || "General")} />
                      <span className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.title} <span className="text-xs text-gray-500 ml-1">[{todo.category || "General"}]</span>
                      </span>
                    </label>
                    {todo.createdAt && <p className="text-xs text-gray-400">Added: {dayjs(todo.createdAt).format("MMM D, YYYY h:mm A")}</p>}
                    {todo.completedAt && <p className="text-xs text-green-500">Completed: {dayjs(todo.completedAt).format("MMM D, YYYY h:mm A")}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(todo)} className="text-blue-500 hover:text-blue-700">✏️</button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
