import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/admin/AdminSidebar.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/courses', icon: '📚', label: 'Manage Courses' },
  { to: '/admin/students', icon: '👨‍🎓', label: 'Manage Students' },
  { to: '/admin/quizzes', icon: '📝', label: 'Manage Quizzes' },
  { to: '/admin/certificates', icon: '🏆', label: 'Certificates' },
  { to: '/admin/batches', icon: '👥', label: 'Batches' },
  { to: '/admin/reports', icon: '📈', label: 'Reports' },
];

// Self-contained: figures out the active link from the route and owns logout,
// so every admin page just renders <AdminSidebar /> with no props/handlers.
const AdminSidebar = () => {
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

      <div className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <div className="admin-sidebar-header">
          <div className="admin-logo">⚙️</div>
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${location.pathname.startsWith(item.to) ? 'active' : ''}`}
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

export default AdminSidebar;
