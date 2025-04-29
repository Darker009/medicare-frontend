import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/AuthService';
import './Register.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const initialFormState = {
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    name: '',
    contact: '',
    specialization: '',
    experience: '',
    shift: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
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
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }
    setImage(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.username)) {
      newErrors.username = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    }

    if (formData.role === 'DOCTOR') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Experience is required';
      } else if (isNaN(formData.experience) || formData.experience < 0 || formData.experience > 100) {
        newErrors.experience = 'Please enter valid experience (0-100 years)';
      }
    }

    if (formData.role === 'NURSE' && !formData.shift) {
      newErrors.shift = 'Please select a shift';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const registrationData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        contact: formData.contact,
        ...(formData.role === 'DOCTOR' && {
          specialization: formData.specialization,
          experience: formData.experience
        }),
        ...(formData.role === 'NURSE' && {
          shift: formData.shift
        }),
        image: image
      };

      const response = await register(registrationData);
      setSuccessMessage(response.message || 'Registration successful!');
      setFormData(initialFormState);
      setImage(null);

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
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Username (Email)*</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error-input' : ''}
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
                className={errors.password ? 'error-input' : ''}
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
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label>Role*</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'error-input' : ''}
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
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
                className={errors.name ? 'error-input' : ''}
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
                className={errors.contact ? 'error-input' : ''}
              />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={errors.image ? 'error-input' : ''}
              />
              {errors.image && <span className="error">{errors.image}</span>}
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
                    className={errors.specialization ? 'error-input' : ''}
                  />
                  {errors.specialization && <span className="error">{errors.specialization}</span>}
                </div>

                <div className="form-group">
                  <label>Experience (years)*</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className={errors.experience ? 'error-input' : ''}
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
                  className={errors.shift ? 'error-input' : ''}
                >
                  <option value="">Select your shift</option>
                  {shifts.map(shift => (
                    <option key={shift.value} value={shift.value}>
                      {shift.label}
                    </option>
                  ))}
                </select>
                {errors.shift && <span className="error">{errors.shift}</span>}
              </div>
            )}

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;