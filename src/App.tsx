import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import TodoPage from "./pages/TodoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/Logout";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLoginSuccess = (t: string) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-50 text-black min-h-screen"}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} token={token} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={token ? <Navigate to="/todos" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!token ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/todos" />} />
          <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/todos" />} />
          <Route path="/todos" element={token ? <TodoPage darkMode={darkMode} token={token} /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}
