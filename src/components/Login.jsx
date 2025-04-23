import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth(); // Add setUser to update the user context
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login request
      const response = await api.post("/api/auth/login", { email, password });

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Update the user context
      setUser(response.data.user);

      console.log("Login successful! Token stored in localStorage.");
      setLoading(false);

      // Redirect based on user role
      if (response.data.user.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <p className="font-medium">Admin Login:</p>
        <p>Use your admin email and password</p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-primary text-white py-2 rounded hover:bg-primary-dark ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;