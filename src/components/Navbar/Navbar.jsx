import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">Medicare+</div>
          <div className="navbar-tagline">Your Health, Our Priority</div>
        </div>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#departments" className="nav-link">Departments</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
          <div className="auth-buttons">
            <a href="#login" className="nav-link login">Login</a>
            <a href="#register" className="nav-link register">Register</a>
          </div>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu} aria-label="Menu">
          <div className={`bar ${isOpen ? 'change' : ''}`}></div>
          <div className={`bar ${isOpen ? 'change' : ''}`}></div>
          <div className={`bar ${isOpen ? 'change' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;