"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
    .get("auth/me")
    .then ((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
    })
    .catch(() => {
        // token invalid/expired — clear stale auth
        localStorage.removeItem("access-token");
        localStorage.removeItem("user");
        setUser(null);
    })
    .finally(() => setLoading(false));
    
  }, []);

  const loginUser = (data) => {
    localStorage.setItem("access-token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);