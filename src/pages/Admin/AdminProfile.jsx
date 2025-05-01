import React, { useEffect, useState, useContext } from 'react';
import './AdminProfile.css';
import adminService from '../../services/adminService';
import { AuthContext } from '../../auth/AuthContext';

const AdminProfile = ({ userId: propUserId }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useContext(AuthContext);

    const userId = propUserId || currentUser?.id;

    useEffect(() => {
        if (!userId) {
            setError('No user ID provided');
            setLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileResponse = await adminService.getAdminProfile(userId);
                const profile = profileResponse;
                
                try {
                    const imageUrl = await adminService.getProfileImage(userId);
                    profile.profilePicUrl = imageUrl;
                } catch (imageError) {
                    profile.profilePicUrl = '/default-profile.png';
                }
                
                setProfileData(profile);
            } catch (err) {
                setError(err.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading admin profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <p className="error-text">{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="no-data-container">
                <div className="no-data-icon">?</div>
                <p>No admin data available</p>
            </div>
        );
    }

    return (
        <div className="admin-profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img 
                            src={profileData.profilePicUrl} 
                            alt="Admin Profile" 
                            className="profile-image"
                            onError={(e) => {
                                e.target.src = '/default-profile.png';
                            }}
                        />
                        <div className="admin-badge">ADMIN</div>
                    </div>
                    <h2 className="profile-name">
                        {profileData.adminName || 'Admin User'}
                        <span className="verified-badge">✓</span>
                    </h2>
                </div>
                
                <div className="profile-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-icon">👤</span>
                            <div>
                                <p className="detail-label">Name</p>
                                <p className="detail-value">{profileData.adminName || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📧</span>
                            <div>
                            <p className="detail-label">Username</p>
                            <p className="detail-value">{profileData.username || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📞</span>
                            <div>
                                <p className="detail-label">Contact</p>
                                <p className="detail-value">{profileData.adminContact || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🆔</span>
                            <div>
                                <p className="detail-label">Admin ID</p>
                                <p className="detail-value">{profileData.adminId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="admin-actions">
                        <button className="edit-button">
                            Edit Profile
                        </button>
                        <button className="settings-button">
                            Account Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;