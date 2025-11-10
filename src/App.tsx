import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoPage from "./pages/TodoPage";
import LogoutPage from "./pages/Logout";
import { getCurrentUser, UserType } from "./api/api"; // ✅ Must match export name exactly

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/todos" /> : <LoginPage setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/todos" /> : <SignupPage setUser={setUser} />}
          />
          <Route path="/todos" element={user ? <TodoPage /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<LogoutPage setUser={setUser} />} />
          <Route path="*" element={<Navigate to={user ? "/todos" : "/login"} />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
