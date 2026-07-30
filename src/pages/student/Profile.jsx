import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/student/Profile.css';

const Profile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // No backend endpoint for updating profile yet — form is read-only for now.
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">👨‍🎓</div>
          <h3>{user.fullName}</h3>
          <p>{user.role || 'Student'}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link active">👤 Profile</Link>
          <button onClick={handleLogout} className="sidebar-link logout">🚪 Logout</button>
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
              <h3>{user.fullName}</h3>
              <p>{user.role || 'Student'}</p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <h3>Personal Information</h3>
              <p style={{ fontSize: '13px', color: 'var(--grey)', marginTop: '-8px', marginBottom: '16px' }}>
                Editing isn't available yet — this is a read-only view for now.
              </p>

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user.fullName || ''} readOnly disabled />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user.email || ''} readOnly disabled />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input type="text" value={user.role || 'Student'} readOnly disabled />
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="password-card">
            <h3>Change Password</h3>
            <p style={{ fontSize: '13px', color: 'var(--grey)', marginBottom: '16px' }}>
              Not available yet — no backend endpoint for this exists.
            </p>
            <form className="profile-form" onSubmit={handlePasswordSubmit}>

              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" disabled />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" disabled />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" disabled />
              </div>

              <button type="submit" className="btn-save" disabled>
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