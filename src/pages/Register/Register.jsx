import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    section: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      if (file.size > maxSize) {
        setError('Image size should be less than 2MB');
        return;
      }

      setProfilePic(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        department: formData.department?.trim(),
        section: formData.section?.trim(),
        profilePic
      };

      // Register user
      await AuthService.register(registrationData);
      setSuccess(true);
      
      // Show success message for 2 seconds before redirecting to login
      setTimeout(() => {
        navigate('/login', {
          state: { 
            registrationSuccess: true,
            registeredEmail: formData.email 
          }
        });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 
              err.message || 
              'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && !error && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Optional"
              autoComplete="organization"
            />
          </div>

          <div className="form-group">
            <label>Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Profile Picture</label>
            <div className="file-upload-container">
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={handleFileChange}
                  className="file-upload-input"
                />
                {profilePic ? profilePic.name : 'Choose a file...'}
              </label>
              {profilePic && (
                <button 
                  type="button" 
                  className="file-remove-btn"
                  onClick={() => setProfilePic(null)}
                >
                  Remove
                </button>
              )}
            </div>
            <small className="file-hint">Max size: 2MB (JPEG, PNG, GIF)</small>
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : 'Register'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;