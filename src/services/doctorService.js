import api from './api.js';


export const getDoctorProfile = async (userId) => {
    try {
      const response = await api.get(`/doctor/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  };

  export default {
    getDoctorProfile,
  };