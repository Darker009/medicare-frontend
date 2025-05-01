import React, { useState, useEffect } from 'react';
import './PendingRequest.css';
import adminService from '../../services/adminService';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingRequest();
    }, []);

    const fetchProfileImageForUser = async (userId) => {
        try {
            return await adminService.getProfileImage(userId);
        } catch (err) {
            console.error("Error fetching user profile image", err);
            return '/default-profile.png';
        }
    };

    const handleStatusUpdate = async (role, id) => {
        try {
            await adminService.approveUser(role, id);
            fetchPendingRequest();
        } catch (error) {
            console.error("Error approving user:", error);
            setError("Failed to approve user.");
        }
    };

    const fetchPendingRequest = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingRequest();
            const data = Array.isArray(response) ? response : response.data || [];

            const updatedRequests = await Promise.all(data.map(async (req) => {
                const imageUrl = await fetchProfileImageForUser(req.id);
                return { 
                    ...req, 
                    profilePicUrl: imageUrl,
                    // Flatten user data for easier access
                    name: req.doctor?.doctorName || req.nurse?.nurseName || req.reception?.receptionName,
                    contact: req.doctor?.doctorContact || req.nurse?.nurseContact || req.reception?.receptionContact,
                    specialization: req.doctor?.doctorSpecialization,
                    experience: req.doctor?.doctorExperience
                };
            }));

            setRequests(updatedRequests);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <h3>Error Loading Requests</h3>
                <p>{error}</p>
                <button 
                    className="retry-button"
                    onClick={fetchPendingRequest}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="pending-requests-container">
            <h2 className="page-title">Pending User Requests</h2>
            
            {requests.length === 0 ? (
                <div className="no-requests">
                    <div className="no-requests-icon">📋</div>
                    <p>No pending requests found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="desktop-table">
                        <table className="requests-table">
                            {/* Table Headers */}
                            <thead>
                                <tr>
                                    <th className="index-col">#</th>
                                    <th className="image-col">Image</th>
                                    <th className="name-col">Name</th>
                                    <th className="username-col">Username</th>
                                    <th className="role-col">Role</th>
                                    <th className="specialization-col">Specialization</th>
                                    <th className="contact-col">Contact</th>
                                    <th className="experience-col">Experience</th>
                                    <th className="status-col">Status</th>
                                </tr>
                            </thead>
                            {/* Table Body */}
                            <tbody>
                                {requests.map((req, index) => (
                                    <tr key={req.id || index}>
                                        <td className="index-col">{index + 1}</td>
                                        <td className="image-col">
                                            <img
                                                src={req.profilePicUrl}
                                                alt="Profile"
                                                className="profile-image"
                                                onError={(e) => {
                                                    e.target.src = '/default-profile.png';
                                                }}
                                            />
                                        </td>
                                        <td className="name-col">{req.name || '—'}</td>
                                        <td className="username-col">{req.username || '—'}</td>
                                        <td className="role-col">{req.role || '—'}</td>
                                        <td className="specialization-col">{req.specialization || '—'}</td>
                                        <td className="contact-col">{req.contact || '—'}</td>
                                        <td className="experience-col">{req.experience || '—'}</td>
                                        <td className="status-col">
                                            <span 
                                                className={`status-badge ${req.status?.toLowerCase()}`}
                                                onClick={() => req.status === 'PENDING' && handleStatusUpdate(req.role, req.id)}
                                            >
                                                {req.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="mobile-cards">
                        {requests.map((req, index) => (
                            <div key={req.id || index} className="request-card">
                                <div className="card-header">
                                    <div className="profile-image-container">
                                        <img
                                            src={req.profilePicUrl}
                                            alt="Profile"
                                            className="profile-image"
                                            onError={(e) => {
                                                e.target.src = '/default-profile.png';
                                            }}
                                        />
                                    </div>
                                    <div className="user-info">
                                        <h3>{req.name || '—'}</h3>
                                        <p className="username">{req.username || '—'}</p>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Role:</span>
                                        <span className="detail-value">{req.role || '—'}</span>
                                    </div>
                                    {req.specialization && (
                                        <div className="detail-row">
                                            <span className="detail-label">Specialization:</span>
                                            <span className="detail-value">{req.specialization}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="detail-label">Contact:</span>
                                        <span className="detail-value">{req.contact || '—'}</span>
                                    </div>
                                    {req.experience && (
                                        <div className="detail-row">
                                            <span className="detail-label">Experience:</span>
                                            <span className="detail-value">{req.experience}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer">
                                    <span 
                                        className={`status-badge ${req.status?.toLowerCase()}`}
                                        onClick={() => req.status === 'PENDING' && handleStatusUpdate(req.role, req.id)}
                                    >
                                        {req.status || '—'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PendingRequests;