"use client"
import { useState } from 'react';
import './Login.css';
import CloseIcon from '@mui/icons-material/Close';
import { query, where, getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { toast, Toaster } from 'sonner';
import Image from 'next/image';

const Login = ({ setIsSignUp, handleClose, setLogged, error, setError, setUserEmail }) => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
   // eslint-disable-next-line 
  const [currentUserId, setCurrentUserId] = useState('');

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
        const userQuery = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            if (userData.password === password) {
                setLogged(true);
               
                localStorage.setItem('loggedUser', email); 
                toast.success('Login successful!', {
                  duration: 2000 // Show toast for 2 seconds
              });

                handleClose();
                setUserEmail(email); // Set the user's email

               
                setEmail('');
            } else {
                setError("Incorrect password.");
            }
        } else {
            setError("User not found.");
        }
    } catch (error) {
        setError("Error logging in.");
        console.log(error)
    }
};

  const handleForgotPasswordMode = () => {
    setForgotPassword(true);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      // Query Firestore to find user ID based on the entered email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email. Please sign up first.');
        return;
      }

      // Assuming email is unique, take the first matching document
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id; // Retrieve the userId from the document ID

      setCurrentUserId(userId); // Set the current userId

      // Update Firestore with the new password using the userId
      const userDocRef = doc(db, "users", userId); // Fetch the user document by userId
      await updateDoc(userDocRef, {
        password: password,  // Update the user's password field in Firestore
        passwordUpdatedTimestamp: new Date()  // Record the password update timestamp
      });
      toast.success('Password updated successfully.', {
        duration: 2000 // Show toast for 2 seconds
      });
      setForgotPassword(false);  // Switch back to login mode
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      
      setError('An error occurred while updating the password. Please try again later.');
    }
  };

  return (
    <div className='login'>
      <Toaster position="top-center" richColors/>
      <CloseIcon className='close-modal' onClick={handleClose} />
      <div className="login-logo">
        <Image src='/assets/logos/medicmode-logo.png' alt="" width={100} height={45} />
      </div>
      <div className="login-form">
        <h1>{forgotPassword ? "Reset Password" : "Login"}</h1>
        <div className="form">
          {error && <p className="incorrect">{error}</p>}

          {/* Forgot Password Flow - Email and New Password Form */}
          {forgotPassword ? (
            <>
              <input type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}/>
				{checked ? (
                <>
                  <input
                    type="text"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              )}
              
			  <div className='show-pwd'>
                  <input type="checkbox" onClick={handleCheck} style={{minWidth: '20px !important'}}/>
                  <p>Show Password</p>
                </div>
              <button className='login-btn' onClick={handleUpdatePassword}>
                Update Password
              </button>
            </>
          ) : (
            <>
              <input type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

              {checked ? <input type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} /> :
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />}

              <div className="forget-pwd">
                <div className='show-pwd'>
                  <input type="checkbox" onClick={handleCheck} />
                  <p>Show Password</p>
                </div>
                <p style={{ cursor: 'pointer', color: 'grey' }}
                  onClick={handleForgotPasswordMode}>Forgot password?</p>
              </div>

              <button className='login-btn'
                onClick={handleLogin}>
                LOGIN
              </button>

              <p style={{fontSize:'13px'}}>Don't have an account? <span style={{ fontWeight: 'bolder', cursor: 'pointer' }}
                  onClick={() => { setIsSignUp(true); setError(''); }}>Sign up</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
