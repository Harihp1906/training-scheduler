import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/public/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h2 className="login-brand">Training Scheduler</h2>
          <h3>Welcome Back</h3>
        </div>

        <button className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div className="login-divider">
          <span>or</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

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

          <div className="login-forgot">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-login-submit">
            Sign In
          </button>

        </form>

        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;