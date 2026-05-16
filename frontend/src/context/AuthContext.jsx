import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    async function loadUser() {
      if (!localStorage.getItem("access")) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me/");
        setUser(data);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        setBooting(false);
      }
    }
    loadUser();
  }, []);

  async function login(values) {
    const { data } = await api.post("/auth/login/", values);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setUser(data.user);
    toast.success("Welcome back");
  }

  async function register(values) {
    await api.post("/auth/register/", values);
    toast.success("Account created. Please log in.");
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    toast.success("Logged out");
  }

  const value = useMemo(() => ({ user, booting, dark, setDark, login, register, logout, isAdmin: user?.role === "admin" }), [user, booting, dark]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
