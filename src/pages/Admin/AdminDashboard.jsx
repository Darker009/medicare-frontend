import React, { useState } from 'react';
import {
  FaUserMd, FaUserNurse, FaUsers, FaClipboardList,
  FaBed, FaFileInvoice, FaUserCog, FaAngleLeft, 
  FaAngleRight, FaHospital, FaCalendarAlt, FaProcedures
} from 'react-icons/fa';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const location = useLocation();


  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="hospital-icon">
            <FaHospital className="icon" />
            {sidebarOpen && <span className="hospital-name">Hospital Admin</span>}
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
          <NavLink to="profile" className="menu-item">
            <FaUserCog className="icon" /> 
            {sidebarOpen && <span>Profile</span>}
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        
          <div className="dashboard-overview">
            <h1>Welcome Admin Saheb</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUserMd />
                </div>
                <h3>Doctors</h3>
                <p>24</p>
                <small>5 available today</small>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaProcedures />
                </div>
                <h3>Patients</h3>
                <p>156</p>
                <small>12 new today</small>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaCalendarAlt />
                </div>
                <h3>Appointments</h3>
                <p>42</p>
                <small>8 completed</small>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBed />
                </div>
                <h3>Rooms</h3>
                <p>18/30</p>
                <small>12 available</small>
              </div>
            </div>
            
            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <ul>
                <li>Dr. Sharma added a new patient record</li>
                <li>Room 205 checked out at 11:30 AM</li>
                <li>New nurse joined the staff</li>
                <li>System backup completed</li>
              </ul>
            </div>
          </div>
       
      </main>
    </div>
  );
};

export default AdminDashboard;