import React from "react";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const bgClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const buttonHoverClass = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-300";

  return (
    <nav className={`flex justify-between items-center px-6 py-3 w-full ${bgClass} shadow`}>
      <div className="text-xl font-bold">📝 Todo App</div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1 rounded border ${buttonHoverClass}`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button className="px-3 py-1 rounded border hover:bg-blue-500 hover:text-white">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
