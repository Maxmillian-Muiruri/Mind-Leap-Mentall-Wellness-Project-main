import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data); // Ensure response includes isAdmin

      // Redirect based on user role
      if (window.location.pathname === "/login") {
        navigate(response.data.isAdmin ? "/admin/dashboard" : "/dashboard");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Update the user context
      setUser(response.data.user);

      // Redirect based on user role
      navigate(response.data.user.isAdmin ? "/admin/dashboard" : "/dashboard");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};