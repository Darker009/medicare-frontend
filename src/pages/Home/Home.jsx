import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Medicare Hospital</h1>
        <p>Your trusted partner in healthcare services</p>
        <button className="cta-button">Book an Appointment</button>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>Emergency Care</h3>
          <p>24/7 emergency services with expert medical staff</p>
        </div>
        <div className="feature-card">
          <h3>Qualified Doctors</h3>
          <p>Experienced specialists in various medical fields</p>
        </div>
        <div className="feature-card">
          <h3>Modern Equipment</h3>
          <p>State-of-the-art medical technology for accurate diagnosis</p>
        </div>
      </div>

      <div className="about-section">
        <h2>About Medicare Hospital</h2>
        <p>
          Medicare Hospital is a leading healthcare provider committed to delivering 
          exceptional medical services with compassion and cutting-edge technology. 
          Our team of dedicated professionals ensures the highest standard of care 
          for all our patients.
        </p>
      </div>
    </div>
  );
};

export default Home;