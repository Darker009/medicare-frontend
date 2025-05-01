import React, { useEffect, useState, useContext } from 'react';
import './DoctorProfile.css';
import adminService from '../../services/adminService';
import doctorService from '../../services/doctorService';
import { AuthContext } from '../../auth/AuthContext';

const DoctorProfile = ({ userId: propUserId }) => {
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
                const profileResponse = await doctorService.getDoctorProfile(userId);
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
                <p>Loading doctor profile...</p>
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
                <p>No doctor data available</p>
            </div>
        );
    }

    return (
        <div className="doctor-profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img 
                            src={profileData.profilePicUrl} 
                            alt="Doctor Profile" 
                            className="profile-image"
                            onError={(e) => {
                                e.target.src = '/default-profile.png';
                            }}
                        />
                        <div className="doctor-badge">DOCTOR</div>
                    </div>
                    <h2 className="profile-name">
                        {profileData.doctorName || 'Doctor User'}
                        <span className="verified-badge">✓</span>
                    </h2>
                </div>
                
                <div className="profile-details">
                    <p className="profile-specialization">
                        {profileData.doctorSpecialization || 'General Practitioner'}
                    </p>
                    
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-icon">👤</span>
                            <div>
                                <p className="detail-label">Username</p>
                                <p className="detail-value">{profileData.username || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📞</span>
                            <div>
                                <p className="detail-label">Contact</p>
                                <p className="detail-value">{profileData.doctorContact || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">⏳</span>
                            <div>
                                <p className="detail-label">Experience</p>
                                <p className="detail-value">
                                    {profileData.doctorExperience ? `${profileData.doctorExperience} years` : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🏥</span>
                            <div>
                                <p className="detail-label">Hospital</p>
                                <p className="detail-value">{profileData.hospital || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="doctor-actions">
                        <button className="contact-button">
                            Contact Doctor
                        </button>
                        <button className="appointment-button">
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;