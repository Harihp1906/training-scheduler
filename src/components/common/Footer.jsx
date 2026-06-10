import { Link } from 'react-router-dom';
import '../styles/common/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h3>Training Scheduler</h3>
          <p>Empowering learners with quality education and professional training programs.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>support@trainingscheduler.com</p>
          <p>Chennai, Tamil Nadu, India</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>© 2024 Training Scheduler. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;