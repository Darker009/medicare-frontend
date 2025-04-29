import { api } from './api';  
import { setToken, setUser, removeToken, removeUser } from './tokenService';

export const register = async (registrationData) => {
  try {
    const formData = new FormData();
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'profilePic') {
        formData.append(key, value);
      }
    });

    if (registrationData.profilePic) {
      formData.append('profilePic', registrationData.profilePic);
    }

    const { data } = await api.post('/auth/register', formData);

    if (data && data.message) {
      return data.message; 
    }

    return data; 
  } catch (error) {
    console.error('Registration failed:', error);
    let errorMessage = 'An error occurred during registration. Please try again later.';
    
    if (error.response && error.response.data?.message) {
      errorMessage = error.response.data.message;
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

    // Debugging: Log the full response
    console.log('Login API Response:', data);

    // Validate response structure
    if (!data?.token) {
      throw new Error('Authentication token is missing');
    }

    if (!data?.user || typeof data.user !== 'object') {
      throw new Error('User data is missing or invalid');
    }

    const requiredUserFields = ['userId', 'username', 'role'];
    for (const field of requiredUserFields) {
      if (!data.user[field]) {
        throw new Error(`Required user field ${field} is missing`);
      }
    }

    // Validate role
    const validRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'];
    if (!validRoles.includes(data.user.role)) {
      throw new Error(`Invalid user role: ${data.user.role}`);
    }

    // Store token and user data
    setToken(data.token);
    setUser(data.user);

    return {
      token: data.token,
      user: data.user
    };

  } catch (error) {
    console.error('Login failed:', error);
    
    // Clear any existing auth data
    removeToken();
    removeUser();

    // Provide better error messages
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
    console.error('Logout API error:', error);
  } finally {
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