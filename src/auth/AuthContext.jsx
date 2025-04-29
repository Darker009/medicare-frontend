import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in

  const login = (userData) => {
    setUser(userData); // store user data
  };

  const logout = () => {
    setUser(null); // clear user data
  };

  const isAuthenticated = !!user; // true if user exists

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
