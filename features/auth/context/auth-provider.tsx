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
import {
  GetUserProfile,
  RegisterCredentials,
  SignIn,
  SignUp,
} from "@/features/auth/api";
import Cookies from "js-cookie"; // Import

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

      Cookies.set("access_token", data.access_token, { expires: 1, path: "/" });

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

      localStorage.setItem("access_token", data.access_token);
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
    Cookies.remove("access_token");
    setUser(null);
    router.push("/signin");
  };

  const verifySession = async () => {
    try {
      const { data } = await GetUserProfile();
      setUser(data);
    } catch (error) {
      console.log("Session expired or invalid" + error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      verifySession();
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
