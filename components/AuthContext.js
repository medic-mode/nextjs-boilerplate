"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userEmail, setUserEmail] = useState('');
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true)

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
    toast.success('Logout successful!', { duration: 3000 })
  };


  return (
    <AuthContext.Provider value={{ userEmail, logged, setUserEmail, setLogged, handleLogin, handleLogout, loading, setLoading }}>
      <Toaster position="top-center" richColors/>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
