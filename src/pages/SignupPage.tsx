import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "../api/authApi";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signup({ username, email, password });
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to signup");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-2 rounded w-full max-w-sm" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 rounded w-full max-w-sm" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 rounded w-full max-w-sm" />
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full max-w-sm mb-2">Sign Up</button>
      <p>
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
