import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/common/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navbar sits outside <Routes> so it never remounts on navigation —
  // re-read localStorage on every route change to pick up login/logout.
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Training Scheduler</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="navbar-buttons">
        {user ? (
          <>
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="btn-login">
              {user.fullName?.split(' ')[0] || 'Dashboard'}
            </Link>
            <button type="button" onClick={handleLogout} className="btn-register btn-navbar-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Sign In</Link>
            <Link to="/register" className="btn-register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;