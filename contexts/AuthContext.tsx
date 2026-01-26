import React, { createContext, useState, useEffect, useMemo } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// In a real app, this would be in a secure backend.
// We simulate it here in localStorage for the demo.
const USERS_STORAGE_KEY = "talent_scout_ai_users";
const SESSION_STORAGE_KEY = "talent_scout_ai_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an active session on initial load
    const checkSession = () => {
      try {
        const session = localStorage.getItem(SESSION_STORAGE_KEY);
        if (session) {
          setUser(JSON.parse(session));
        }
      } catch (error) {
        console.error("Failed to parse session:", error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate network delay
        const storedUsers = JSON.parse(
          localStorage.getItem(USERS_STORAGE_KEY) || "[]",
        );
        const foundUser = storedUsers.find(
          (u: any) => u.email === email && u.password === pass,
        ); // NOTE: NEVER store plain text passwords! This is for demo only.

        if (foundUser) {
          const { password, ...userToSave } = foundUser;
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userToSave));
          setUser(userToSave);
          resolve();
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 500);
    });
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(
          localStorage.getItem(USERS_STORAGE_KEY) || "[]",
        );
        const userExists = storedUsers.some((u: any) => u.email === email);

        if (userExists) {
          reject(new Error("An account with this email already exists."));
          return;
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password: pass, // Again, demo only. Use hashing in a real app.
          role: "HR" as const,
        };

        storedUsers.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));

        const { password, ...userToSave } = newUser;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userToSave));
        setUser(userToSave);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updatedData };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

      // Also update the master user list
      const storedUsers = JSON.parse(
        localStorage.getItem(USERS_STORAGE_KEY) || "[]",
      );
      const userIndex = storedUsers.findIndex(
        (u: any) => u.id === updatedUser.id,
      );
      if (userIndex > -1) {
        const originalUser = storedUsers[userIndex];
        storedUsers[userIndex] = { ...originalUser, ...updatedData };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
      }
      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
