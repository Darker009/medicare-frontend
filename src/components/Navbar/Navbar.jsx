import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './Navbar.css';
import { useAuth } from '../../auth/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {user, logout} = useAuth();
  const navigation = useNavigate();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    Navigate('/login');
    setIsOpen(false);
  };
  const handleLinkClick = () => {
    setIsOpen(false);
  };
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
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/departments" className="nav-link">Departments</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <div className="auth-buttons">
            <Link to="/login" className="nav-link login">Login</Link>
            <Link to="/register" className="nav-link register">Register</Link>
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
