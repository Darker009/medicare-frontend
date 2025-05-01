import React, { useState } from 'react';
import {
  FaUserMd, FaUserNurse, FaUsers, FaClipboardList,
  FaBed, FaFileInvoice, FaUserCog, FaAngleLeft, 
  FaAngleRight, FaHospital, FaCalendarAlt, FaProcedures, FaHourglassHalf 
} from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="hospital-icon">
            <FaHospital className="icon" />
            {sidebarOpen && <span className="hospital-name">Hospital Doctor</span>}
          </div>
          <div className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
          </div>
        </div>
        <nav className="menu">
          <NavLink to="doctors" className="menu-item">
            <FaUserMd className="icon" /> 
            {sidebarOpen && <span>Doctors</span>}
          </NavLink>
          <NavLink to="nurses" className="menu-item">
            <FaUserNurse className="icon" /> 
            {sidebarOpen && <span>Nurses</span>}
          </NavLink>
          <NavLink to="receptions" className="menu-item">
            <FaUsers className="icon" /> 
            {sidebarOpen && <span>Receptions</span>}
          </NavLink>
          <NavLink to="patients" className="menu-item">
            <FaClipboardList className="icon" /> 
            {sidebarOpen && <span>Patients</span>}
          </NavLink>
          <NavLink to="rooms" className="menu-item">
            <FaBed className="icon" /> 
            {sidebarOpen && <span>Rooms</span>}
          </NavLink>
          <NavLink to="bills" className="menu-item">
            <FaFileInvoice className="icon" /> 
            {sidebarOpen && <span>Bills</span>}
          </NavLink>
          <NavLink to="pending-requests" className="menu-item">
            <FaHourglassHalf className="icon" />
            {sidebarOpen && <span>Pending Requests</span>}
          </NavLink>
          <NavLink to="profile" className="menu-item">
            <FaUserCog className="icon" /> 
            {sidebarOpen && <span>Profile</span>}
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet /> {/* This will render the nested route content */}
      </main>
    </div>
  );
};

export default DoctorDashboard;