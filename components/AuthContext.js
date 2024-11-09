"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userEmail, setUserEmail] = useState('');
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

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

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsSignUp(false);
    setError("");
  };

  return (
    <AuthContext.Provider value={{ userEmail, logged, handleOpen, handleClose, setUserEmail, setLogged, handleLogin, handleLogout, loading, setLoading, open, setOpen, isSignUp, setIsSignUp, error, setError}}>
      <Toaster position="top-center" richColors/>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
