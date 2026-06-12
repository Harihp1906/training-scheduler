import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/student/Profile.css';

const Profile = () => {

  const [formData, setFormData] = useState({
    fullName: 'Hari Preyadharshan S P',
    email: 'hari@example.com',
    phone: '9876543210',
    qualification: 'B.E Electronics and Communication',
    bio: 'Passionate about technology and learning new skills.'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">👨‍🎓</div>
          <h3>Hari Preyadharshan</h3>
          <p>Student</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link active">👤 Profile</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        <div className="dashboard-welcome">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-grid">

          {/* Profile Info */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">👨‍🎓</div>
              <h3>Hari Preyadharshan S P</h3>
              <p>Student</p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <h3>Personal Information</h3>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Highest Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="password-card">
            <h3>Change Password</h3>
            <form className="profile-form" onSubmit={handlePasswordSubmit}>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <button type="submit" className="btn-save">
                Change Password
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;