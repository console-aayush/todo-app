import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../api/api";

export default function LogoutPage({ setUser }: { setUser: (u: any) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/login");
      } catch (err: any) {
        toast.error(err.message || "Logout failed");
      }
    };
    performLogout();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <p className="text-lg font-medium">Logging out...</p>
    </div>
  );
}
