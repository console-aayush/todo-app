import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { Todo } from "../api/todoApi";
import { fetchAllTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").refine((val) => isNaN(Number(val)), "Numbers are not allowed"),
  completed: z.boolean().optional(),
  category: z.string().optional(),
});

interface TodoPageProps {
  darkMode: boolean;
}

const TodoPage: React.FC<TodoPageProps> = ({ darkMode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [category, setCategory] = useState("General");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCategory, setEditingCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");

  const loadTodos = async () => {
    try {
      const data = search ? await searchTodos(search) : await fetchAllTodos();
      setTodos(data);
    } catch {
      toast.error("Failed to load todos");
    }
  };

  useEffect(() => {
    loadTodos();
  }, [search]);

  const handleAddTodo = async () => {
    const validation = todoSchema.safeParse({ title: newTodo, category });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    try {
      const newItem = await addTodo({ title: newTodo, completed: false, category });
      setTodos((prev) => [newItem, ...prev]);
      setNewTodo("");
      setCategory("General");
      toast.success("Todo added!");
    } catch {
      toast.error("Failed to add todo");
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo.id, { title: todo.title, completed: !todo.completed, category: todo.category || "General" });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch {
      toast.error("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      toast.info("Todo deleted");
    } catch {
      toast.error("Failed to delete todo");
    }
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

  const saveEdit = async (todo: Todo) => {
    const validation = todoSchema.safeParse({ title: editingTitle, category: editingCategory });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    try {
      const updated = await updateTodo(todo.id, { title: editingTitle, completed: todo.completed, category: editingCategory });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      cancelEdit();
      toast.success("Todo updated!");
    } catch {
      toast.error("Failed to update todo");
    }
  };

  const visibleTodos = todos.filter((todo) =>
    filter === "All" ? true : filter === "Completed" ? todo.completed : !todo.completed
  );

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-white";
  const buttonHoverClass = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-300";

  return (
    <div className={`min-h-screen flex flex-col items-center pt-6 px-4 ${bgClass}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Add Todo */}
      <div className="flex gap-2 w-full max-w-md mb-4">
        <input type="text" placeholder="Add a new todo..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} className="flex-1 border p-2 rounded" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Shopping</option>
        </select>
        <button onClick={handleAddTodo} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
          Add
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 w-full max-w-md mb-6">
        <input type="text" placeholder="Search todos..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 border p-2 rounded" />
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
                  <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="border p-2 rounded w-full" />
                  <select value={editingCategory} onChange={(e) => setEditingCategory(e.target.value)} className="border p-2 rounded w-full">
                    <option>General</option>
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Shopping</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(todo)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                    <button onClick={cancelEdit} className={`px-3 py-1 rounded ${buttonHoverClass}`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col flex-1 gap-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo)} />
                      <span className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.title} <span className="text-xs text-gray-500 ml-1">[{todo.category || "General"}]</span>
                      </span>
                    </label>
                    {todo.created_at && <p className="text-xs text-gray-400">Added: {dayjs(todo.created_at).format("MMM D, YYYY h:mm A")}</p>}
                    {todo.updated_at && todo.completed && <p className="text-xs text-green-500">Completed: {dayjs(todo.updated_at).format("MMM D, YYYY h:mm A")}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(todo)} className="text-blue-500 hover:text-blue-700">✏️</button>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoPage;
