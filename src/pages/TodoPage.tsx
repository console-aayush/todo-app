import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { fetchTodos, addTodo, updateTodo, deleteTodo, toggleTodo } from "../api/api";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      toast.error("Failed to load todos. Please login again.");
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return toast.warn("Enter a title");
    await addTodo({ title });
    setTitle("");
    loadTodos();
  };

  const handleUpdate = async () => {
    if (!editingId || !title.trim()) return;
    await updateTodo(editingId, { title });
    setEditingId(null);
    setTitle("");
    loadTodos();
  };

  const handleToggle = async (id: number) => {
    await toggleTodo(id);
    loadTodos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this todo?")) return;
    await deleteTodo(id);
    loadTodos();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-lg mx-auto pt-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">📝 My Todos</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {editingId ? (
            <button onClick={handleUpdate} className="bg-yellow-500 text-white px-4 rounded-lg">
              Update
            </button>
          ) : (
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded-lg">
              Add
            </button>
          )}
        </div>

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center bg-white border p-3 rounded-xl shadow-sm">
              <span
                onClick={() => handleToggle(todo.id)}
                className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-gray-400" : ""}`}
              >
                {todo.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setTitle(todo.title);
                  }}
                  className="bg-yellow-400 text-black px-2 py-1 rounded-md"
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(todo.id)} className="bg-red-500 text-white px-2 py-1 rounded-md">
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
