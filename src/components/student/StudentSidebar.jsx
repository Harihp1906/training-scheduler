import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/student/StudentSidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/my-courses', icon: '📚', label: 'My Courses' },
  { to: '/courses', icon: '🔍', label: 'Browse Courses' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

// Self-contained like AdminSidebar, except the profile name/role comes from
// the caller (each page already loads `user` from localStorage/API on its
// own schedule, so re-deriving it here would just duplicate that loading state).
const StudentSidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <div className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <div className="sidebar-profile">
          <div className="sidebar-avatar">👨‍🎓</div>
          <h3>{user?.fullName}</h3>
          <p>Student</p>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="sidebar-link logout">🚪 Logout</button>
        </nav>
      </div>
    </>
  );
};

export default StudentSidebar;
