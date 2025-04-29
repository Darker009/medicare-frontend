import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/AuthService';
import './Register.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    name: '',
    contact: '',
    specialization: '',
    experience: '',
    shift: ''
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const roles = [
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'RECEPTIONIST', label: 'Receptionist' }
  ];

  const shifts = [
    { value: 'MORNING', label: 'Morning (8AM - 4PM)' },
    { value: 'EVENING', label: 'Evening (4PM - 12AM)' },
    { value: 'NIGHT', label: 'Night (12AM - 8AM)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'role') {
      setErrors(prev => ({
        ...prev,
        specialization: undefined,
        experience: undefined,
        shift: undefined
      }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.username)) newErrors.username = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.role) newErrors.role = 'Role is required';
    
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.contact) newErrors.contact = 'Contact is required';
    else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.contact)) newErrors.contact = 'Invalid contact number';
    
    if (formData.role === 'DOCTOR') {
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.experience) newErrors.experience = 'Experience is required';
      else if (isNaN(formData.experience) || formData.experience < 0 || formData.experience > 100) {
        newErrors.experience = 'Experience must be between 0-100 years';
      }
    }
    
    if (formData.role === 'NURSE' && !formData.shift) newErrors.shift = 'Shift is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const registrationData = {
        email: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        contact: formData.contact,
        profilePic: image
      };

      // Add role-specific fields
      if (formData.role === 'DOCTOR') {
        registrationData.specialization = formData.specialization;
        registrationData.experience = formData.experience;
      } else if (formData.role === 'NURSE') {
        registrationData.shift = formData.shift;
      }

      const message = await register(registrationData);
      
      setSuccessMessage(message || 'Registration successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Medicare Staff Registration</h2>
        
        {successMessage ? (
          <div className="success-message">
            <p>{successMessage}</p>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label>Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 8 characters)"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label>Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-group">
              <label>Role*</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>
            
            <div className="form-group">
              <label>Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Contact Number*</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
              />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>
            
            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            
            {formData.role === 'DOCTOR' && (
              <>
                <div className="form-group">
                  <label>Specialization*</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Enter your medical specialization"
                  />
                  {errors.specialization && <span className="error">{errors.specialization}</span>}
                </div>
                
                <div className="form-group">
                  <label>Years of Experience*</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="100"
                  />
                  {errors.experience && <span className="error">{errors.experience}</span>}
                </div>
              </>
            )}
            
            {formData.role === 'NURSE' && (
              <div className="form-group">
                <label>Shift*</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                >
                  <option value="">Select your shift</option>
                  {shifts.map(shift => (
                    <option key={shift.value} value={shift.value}>{shift.label}</option>
                  ))}
                </select>
                {errors.shift && <span className="error">{errors.shift}</span>}
              </div>
            )}
            
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;