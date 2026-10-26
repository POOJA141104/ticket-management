import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing session on app launch
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // Refresh user data in background
          api.get("/auth/me").then((res) => {
            const refreshedUser = res.data?.data || res.data?.user;
            if (refreshedUser) {
              setUser(refreshedUser);
              AsyncStorage.setItem("user", JSON.stringify(refreshedUser));
            }
          }).catch((err) => {
            if (err.response?.status === 401) {
              AsyncStorage.multiRemove(["token", "user"]);
              setUser(null);
            }
          });
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed. Please check network and credentials.",
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const updateUserData = async (newUserData) => {
    setUser(newUserData);
    await AsyncStorage.setItem("user", JSON.stringify(newUserData));
  };

  const isSuperAdmin = () => user?.role?.name === "SuperAdmin";
  const isUser = () => user?.role?.name === "User";
  const isStaff = () =>
    ["Networking Staff", "Plumber", "Electrician", "Software Developer"].includes(
      user?.role?.name
    );
  const canRaise = () => ["SuperAdmin", "User"].includes(user?.role?.name);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserData,
        isSuperAdmin,
        isUser,
        isStaff,
        canRaise,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

