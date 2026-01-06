"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api";
import { User } from "@/features/auth/types";
import { AxiosError } from "axios";
import { RegisterCredentials, SignIn, SignUp } from "@/features/auth/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (
    data: RegisterCredentials
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get<User>("/users/");
      setUser(data);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await SignIn({ email, password });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      router.push("/");
      return { success: true };
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return {
        success: false,
        message: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data } = await SignUp(credentials);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      router.push("/");

      return { success: true };
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return {
        success: false,
        message: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
