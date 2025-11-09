import { useState } from "react";
import Navbar from "./component/Navbar";
import TodoPage from "./pages/TodoPage";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-50 text-black min-h-screen"}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <TodoPage darkMode={darkMode} />
    </div>
  );
}
