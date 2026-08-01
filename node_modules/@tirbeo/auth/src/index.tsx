"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User } from "@tirbeo/types";
import { apiClient } from "@tirbeo/api-client";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.get<User>("/api/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await apiClient.post<{ error?: string }>("/api/auth/login", { email, password });
      if (error) return { error };
      const data = await apiClient.get<User>("/api/me");
      setUser(data);
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || "Sign in failed" };
    }
  };

  const signInWithOAuth = async (provider: string) => {
    window.location.href = `/api/auth/oauth/authorize?provider=${provider}`;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { error } = await apiClient.post<{ error?: string }>("/api/auth/signup", { email, password, displayName });
      if (error) return { error };
      const data = await apiClient.get<User>("/api/me");
      setUser(data);
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || "Sign up failed" };
    }
  };

  const signOut = async () => {
    await apiClient.post("/api/auth/logout");
    setUser(null);
  };

  const refreshSession = async () => {
    try {
      const data = await apiClient.get<User>("/api/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signInWithOAuth,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}