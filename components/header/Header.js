"use client";
import "./Header.css";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { Box, Modal } from "@mui/material";
import Login from "../login/Login";
import Signup from "../signup/Signup";
import { useAuth } from "../AuthContext";

const Header = () => {
  const { setUserEmail, logged, setLogged, handleLogout, userEmail, handleOpen, handleClose, isSignUp, setIsSignUp, error, setError, open} = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1400,
    bgcolor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    padding: "100px 20px 20px",
  };

  

  return (
    <div className="navbar">
      <div className="nav-images">
        <Link href="/">
          <Image
            className="headerlogo"
            src="/assets/logos/medicmode-logo.png"
            alt="medicmode-logo"
            width={150}
            height={60}
          />
        </Link>
        <Link
          href="https://www.facebook.com/medicmodeofficial"
          target="_blank"
          rel="noreferrer"
        >
          <FacebookIcon className="social-icon" />
        </Link>
        <Link
          href="https://www.instagram.com/medicmode/"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon className="social-icon" />
        </Link>
        <Link
          href="https://www.linkedin.com/company/medicmode-llp/"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon className="social-icon" />
        </Link>
        <Link
          href="https://www.youtube.com/@medicmode623/"
          target="_blank"
          rel="noreferrer"
        >
          <YouTubeIcon
            className="social-icon utube-icon"
            style={{ fontSize: "30px" }}
          />
        </Link>
      </div>
      <div className="nav-links">
        <div className={`nav-list ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                HOME
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                ABOUT US
              </Link>
            </li>
            <li>
              <Link href="/courses" onClick={() => setIsMenuOpen(false)}>
                COURSES
              </Link>
            </li>
            <li>
              <Link href="/blogs" onClick={() => setIsMenuOpen(false)}>
                BLOGS
              </Link>
            </li>
            <li>
              <Link href="/careers" onClick={() => setIsMenuOpen(false)}>
                CAREERS
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                CONTACT US
              </Link>
            </li>
            {userEmail === 'admin@medicmode.com' && 
            <li>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                DASHBOARD
              </Link>
            </li>
            }
          </ul>
        </div>
        <div className="account">
          {logged ? (
            <button className="login-register-btn" onClick={handleLogout} >
              LOGOUT
            </button>
          ) : (
            <button className="login-register-btn" onClick={handleOpen}>
              LOGIN
            </button>
          )}
        </div>
      </div>
      <div className="menu-icon">
        <Hamburger
          toggled={isMenuOpen}
          toggle={toggleMenu}
          rounded
          hideOutline={false}
          size={25}
        />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {isSignUp ? (
            <Signup
              error={error}
              setError={setError}
              setIsSignUp={setIsSignUp}
              handleClose={handleClose}
            />
          ) : (
            <Login
              setLogged={setLogged}
              handleOpen={handleOpen}
              handleClose={handleClose}
              setIsSignUp={setIsSignUp}
              error={error}
              setError={setError}
              setUserEmail={setUserEmail}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Header;
