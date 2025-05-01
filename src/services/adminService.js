import api from './api';

export const arrayBufferToBase64 = (buffer) => {
  if (!buffer) return null;
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/jpeg;base64,${window.btoa(binary)}`;
};

export const getAdminProfile = async (userId) => {
  try {
    const response = await api.get(`/admin/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

export const getProfileImage = async (userId) => {
  if (!userId) throw new Error('User ID is required to fetch profile image');
  try {
    const { data } = await api.get(`/auth/image/${userId}`, { 
      responseType: 'arraybuffer' 
    });
    return arrayBufferToBase64(data);
  } catch (err) {
    console.error(`Failed to fetch profile image for user ${userId}:`, err);
    return '/default-profile.png';
  }
};


export const getPendingRequest = async () => {
  try {
    const response = await api.get('/admin/fetch-all/requests');
    console.log('Response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending request', error);
    throw error;
  }
};

// Approve user request
export const approveUser = async (role, id) => {
  try {
    const response = await api.post(`/admin/approve/${role}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error approving request', error);
    throw error;
  }
};

export default {
  getAdminProfile,
  getProfileImage,
  getPendingRequest,
  approveUser
};
