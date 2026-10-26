import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isSuperAdmin = () => user?.role?.name === "SuperAdmin";
  const isUser       = () => user?.role?.name === "User";
  const isStaff      = () => ["Networking Staff","Plumber","Electrician","Software Developer"].includes(user?.role?.name);
  const canRaise     = () => ["SuperAdmin","User"].includes(user?.role?.name);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin, isUser, isStaff, canRaise }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
