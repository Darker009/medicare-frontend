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
    const { data } = await api.post('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });

    if (!data || !data.token || !data.user) {
      throw new Error('Invalid login response structure');
    }

    if (!['ROLE_ADMIN', 'ROLE_STUDENT'].includes(data.user.role)) {
      throw new Error('Invalid user role');
    }

    setToken(data.token);
    setUser(data.user);

    return data;
  } catch (error) {
    console.error('Login failed:', error);

    removeToken();
    removeUser();
    
    let errorMessage = 'Login failed. Please try again.';
    if (error.response && error.response.data?.message) {
      errorMessage = error.response.data.message || errorMessage;
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
