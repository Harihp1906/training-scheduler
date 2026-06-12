import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/public/Register.css';

const Register = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', formData);
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <h2 className="register-brand">Training Scheduler</h2>
          <h3>Create Account</h3>
          <p>Start your learning journey today</p>
        </div>

        <button className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div className="register-divider">
          <span>or</span>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-register-submit">
            Create Account
          </button>

        </form>

        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;