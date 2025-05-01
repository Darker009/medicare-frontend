import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PendingRequests from './pages/Admin/PendingRequests';
import AdminProfile from './pages/Admin/AdminProfile';
import DoctorDashboard from './pages/Doctor/DoctorDashboard'; 
import DoctorProfile from './pages/Doctor/DoctorProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route index element={
                  <div className="dashboard-overview">
                    <h1>Welcome Admin Saheb</h1>
                    <div className="stats-grid">
                    </div>
                  </div>
                } />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="pending-requests" element={<PendingRequests />} />
              </Route>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} >
              <Route index element={
                <div className='dashboard-overview'>
                  <h1>Welcome Doctor Dashboard</h1>
                  <div className="stats-grid">

                  </div>
                </div>
              } />
                <Route path="profile" element={<DoctorProfile/>} />

              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;