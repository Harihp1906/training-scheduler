import { Link } from 'react-router-dom';
import '../styles/common/Navbar.css';

const Navbar = () => {
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
        <Link to="/login" className="btn-login">Sign In</Link>
        <Link to="/register" className="btn-register">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;