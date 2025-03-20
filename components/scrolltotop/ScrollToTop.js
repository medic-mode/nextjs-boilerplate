"use client";
import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        bottom: "90px",
        right: "30px",
        width: "45px",
        height: "45px",
        backgroundColor: "var(--background-color)",
        border: "1px solid var(--dark-green)",
        borderRadius: "50%",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "opacity 0.3s ease-in-out, transform 0.2s ease-in-out",
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
    >
      <KeyboardArrowUpIcon style={{fontSize:'25px', color:'var(--dark-green)', cursor:'pointer'}} />
    </button>
  );
};

export default ScrollToTop;
