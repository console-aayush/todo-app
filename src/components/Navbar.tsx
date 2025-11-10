import { useNavigate } from "react-router-dom";
import { logout } from "../api/api";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Logged out!");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="font-semibold text-lg cursor-pointer" onClick={() => navigate("/todos")}>
        Todo App
      </h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-3 py-1 rounded-lg font-semibold hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  );
}
