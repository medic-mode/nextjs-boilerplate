"use client"
import { useState } from 'react';
import './Login.css';
import CloseIcon from '@mui/icons-material/Close';
import { query, where, getDocs, collection, doc, updateDoc, deleteField } from "firebase/firestore";
import { db, auth } from '../../lib/firebase';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail
} from "firebase/auth";
import { useRouter } from 'next/navigation';

const Login = ({ setIsSignUp, handleClose, setLogged, error, setError, setUserEmail }) => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setSubmitted(true);
  setError("");

  const sanitizedEmail = email.trim().toLowerCase();

  try {
    // 1. Try standard Firebase Auth login
    await signInWithEmailAndPassword(auth, sanitizedEmail, password);
  } catch (authError) {
    // 2. If login fails, check if we need to migrate this user
    // 'auth/invalid-credential' is the common error for missing users or wrong pwd in v10+
    if (authError.code === "auth/user-not-found" || authError.code === "auth/invalid-credential") {
      try {
        const res = await fetch("/api/migrate-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sanitizedEmail, password }),
        });

        const data = await res.json();

        if (res.ok) {
          // 3. Migration successful, try logging in again
          await signInWithEmailAndPassword(auth, sanitizedEmail, password);
        } else {
          // Migration failed (e.g., wrong password in Firestore)
          setError(data.error || "Invalid credentials");
          setSubmitted(false);
          return;
        }
      } catch (migrationErr) {
        setError("Login failed. Please try again.");
        setSubmitted(false);
        return;
      }
    } else {
      setError("Invalid email or password.");
      setSubmitted(false);
      return;
    }
  }

  // 4. Success logic
  setLogged(true);
  setUserEmail(sanitizedEmail);
  toast.success('Login successful!');
  handleClose();
  setSubmitted(false);
};

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email to receive a reset link.");
      return;
    }
    setSubmitted(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      toast.success("Reset link sent to your email!");
      setForgotPassword(false); 
    } catch (err) {
      setError("Failed to send reset email. Check if the email is correct.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className='login' style={{ fontFamily: '"Montserrat", sans-serif' }}>
      <CloseIcon className='close-modal' onClick={handleClose} />
      
      <div className="login-logo">
        <Image src='/assets/logos/medicmode-logo.png' alt="" width={100} height={45} />
      </div>

      <div className="login-form">
        <h1>{forgotPassword ? "Reset Password" : "Login"}</h1>
        
        <div className="form">
          {error && <p className="incorrect">{error}</p>}

          <input 
            type="text"
            placeholder={forgotPassword ? "Enter your email id" : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />

          {!forgotPassword ? (
            <>
              {/* Login View */}
              <input 
                type={checked ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />

              <div className="forget-pwd">
                <div className='show-pwd'>
                  <input type="checkbox" onChange={handleCheck} checked={checked} />
                  <p>Show Password</p>
                </div>
                <p 
                  style={{ cursor: 'pointer', color: 'grey' }}
                  onClick={() => { setForgotPassword(true); setError(''); }}
                >
                  Forgot password?
                </p>
              </div>

              <Button 
                className="login-btn" 
                label={submitted ? <i className="pi pi-spin pi-spinner"></i> : "LOGIN"} 
                disabled={submitted} 
                onClick={handleLogin}
              />

              <p style={{ fontSize: '13px' }}>
                Don't have an account? 
                <span 
                  style={{ fontWeight: 'bolder', cursor: 'pointer', marginLeft: '5px' }}
                  onClick={() => { setIsSignUp(true); setError(''); }}
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              {/* Password Reset View */}
              <p style={{ fontSize: '12px', textAlign: 'center', color: 'grey' }}>
                We'll send you a secure link to reset your password.
              </p>

              <Button 
                className="login-btn" 
                label={submitted ? <i className="pi pi-spin pi-spinner"></i> : "SEND RESET LINK"} 
                disabled={submitted} 
                onClick={handleResetRequest}
                style={{fontFamily:'inherit'}}
              />

              <p 
                style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => { setForgotPassword(false); setError(''); }}
              >
                ← Back to Login
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
