"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('loggedUser');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setLogged(true);
    }
  }, []);

  const handleLogin = (email) => {
    setUserEmail(email);
    setLogged(true);
    localStorage.setItem('loggedUser', email);
  };

  const handleLogout = () => {
    setLogged(false);
    setUserEmail('');
    localStorage.removeItem('loggedUser');
  };


  return (
    <AuthContext.Provider value={{ userEmail, logged, setUserEmail, setLogged, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
