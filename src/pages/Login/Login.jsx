import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import AuthService from '../../services/AuthService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Registration successful! Please login');
      
      if (location.state?.registeredUsername) {
        setFormData(prev => ({
          ...prev,
          username: location.state.registeredUsername
        }));
      }

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
  
    // Validate form inputs
    if (!formData.username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }
  
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
  
    try {
      // Call AuthService.login
      const { user, token } = await AuthService.login({
        username: formData.username.trim().toLowerCase(),
        password: formData.password
      });
  
      // Login to auth context
      login(user, token);
  
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor/dashboard');
          break;
        case 'NURSE':
          navigate('/nurse/dashboard');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist/dashboard');
          break;
        case 'PATIENT':
          navigate('/patient/dashboard');
          break;
        default:
          throw new Error('Unknown role, cannot navigate');
      }
  
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      }
  
      if (errorMessage.toLowerCase().includes('credentials') || 
          errorMessage.toLowerCase().includes('password')) {
        errorMessage = 'Invalid username or password';
      }
  
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Medicare</h2>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              autoComplete="username"
              className={error ? 'input-error' : ''}
              aria-describedby={error ? "username-error" : undefined}
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