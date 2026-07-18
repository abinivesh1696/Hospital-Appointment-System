import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Initialize Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load User Profile on refresh/mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const { data } = await api.get("/auth/profile");
          setUser(data);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  // Register handler
  const register = async (registerData) => {
    try {
      const { data } = await api.post("/auth/register", registerData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Update profile handler (supports regular objects and FormData for profile images)
  const updateProfile = async (profileData, isMultipart = false) => {
    try {
      const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : {};
      const { data } = await api.put("/auth/profile", profileData, { headers });
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Profile update failed";
    }
  };

  // Toggle theme mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;