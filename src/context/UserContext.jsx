import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem("app_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("app_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("app_user");
    }
  }, [user]);

  const setUser = (u) => setUserState(u);
  const clearUser = () => setUserState(null);

  const addAppointment = (appointment) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      appointments: [...(user.appointments || []), appointment]
    };

    setUserState(updatedUser);

    // Actualizar en "base de datos"
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = existingUsers.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(existingUsers));
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, addAppointment }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
