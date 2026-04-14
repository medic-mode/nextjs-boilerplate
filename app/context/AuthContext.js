"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userEmail, setUserEmail] = useState('');
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setLogged(true);
      } else {
        setUserEmail('');
        setLogged(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUserEmail(user.email);
    setLogged(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 

      setUserEmail('');
      setLogged(false);

      toast.success('Logout successful!', { duration: 3000 });
    } catch (err) {
      console.error(err);
      toast.error('Error logging out');
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsSignUp(false);
    setError("");
  };

  return (
    <AuthContext.Provider value={{
      userEmail,
      logged,
      handleOpen,
      handleClose,
      setUserEmail,
      setLogged,
      handleLogin,
      handleLogout,
      loading,
      setLoading,
      open,
      setOpen,
      isSignUp,
      setIsSignUp,
      error,
      setError
    }}>
      <Toaster position="top-center" richColors />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);