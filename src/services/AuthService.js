import { api } from './api';
import { setToken, setUser, removeToken, removeUser } from './tokenService';

export const register = async (registrationData) => {
  try {
    const formData = new FormData();
    
    // Append required fields for all roles
    formData.append('username', registrationData.username);
    formData.append('password', registrationData.password);
    formData.append('role', registrationData.role);
    formData.append('name', registrationData.name);
    formData.append('contact', registrationData.contact);

    // Append role-specific fields
    if (registrationData.role === 'DOCTOR') {
      formData.append('specialization', registrationData.specialization);
      formData.append('experience', registrationData.experience);
    } else if (registrationData.role === 'NURSE') {
      formData.append('shift', registrationData.shift);
    }

    // Append image if provided
    if (registrationData.image) {
      formData.append('image', registrationData.image);
    }

    const response = await api.post('/auth/register', formData);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    return {
      success: true,
      message: response.data.message || 'Registration successful',
      data: response.data
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed. Please try again.';
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.message) {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      username: credentials.username.trim().toLowerCase(),
      password: credentials.password
    });

    const { data } = response;

    // Validate response structure
    if (!data?.token) {
      throw new Error('Authentication token is missing');
    }

    if (!data?.user || typeof data.user !== 'object') {
      throw new Error('Invalid user data received');
    }

    // Update required fields to match backend response
    const requiredFields = ['userId', 'username', 'role'];
    for (const field of requiredFields) {
      if (!data.user[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate role
    const validRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'];
    if (!validRoles.includes(data.user.role)) {
      throw new Error(`Invalid role: ${data.user.role}`);
    }

    // Normalize user object to ensure consistent field names
    const normalizedUser = {
      id: data.user.userId,  // Map userId to id for consistency
      username: data.user.username,
      role: data.user.role
    };

    // Store authentication data
    setToken(data.token);
    setUser(normalizedUser);

    return {
      token: data.token,
      user: normalizedUser
    };

  } catch (error) {
    console.error('Login error:', error);
    
    // Clear any existing auth data
    removeToken();
    removeUser();

    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear client-side auth data
    removeToken();
    removeUser();
  }
};



const AuthService = {
  register,
  login,
  logout
};

export default AuthService;