import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import AuthService from '../../services/AuthService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for registration success state when component mounts
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Registration successful! Please login');
      
      // Pre-fill email if it was passed from registration
      if (location.state?.registeredEmail) {
        setFormData(prev => ({
          ...prev,
          email: location.state.registeredEmail
        }));
      }

      // Clear the location state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic client-side validation
    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (!response?.user || !response?.token) {
        throw new Error('Invalid server response');
      }

      // Check if role exists and is valid
      if (!response.user.role || !['ROLE_ADMIN', 'ROLE_STUDENT'].includes(response.user.role)) {
        throw new Error('Invalid user role');
      }

      // Save user data and token
      login(response.user, response.token);

    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Handle HTTP errors
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      'Invalid credentials';
      } else if (err.message) {
        // Handle custom errors
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to BookVault</h2>
        
        {/* Success message from registration */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Error message from login attempt */}
        {error && (
          <div className="error-message">
            {error}
            {(error.toLowerCase().includes('credentials') || 
             error.toLowerCase().includes('password')) && (
              <div className="forgot-password-container">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="username"
              className={error ? 'input-error' : ''}
              aria-describedby={error ? "email-error" : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter your password"
              autoComplete="current-password"
              className={error ? 'input-error' : ''}
              aria-describedby={error ? "password-error" : undefined}
            />
          </div>

          <button 
            type="submit" 
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p className="register-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;