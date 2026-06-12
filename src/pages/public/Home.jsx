import { Link } from 'react-router-dom';
import '../styles/public/Home.css';

const Home = () => {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Learn Without Limits</h1>
          <p>Access professional training programs designed to boost your career. Learn at your own pace with expert-led courses.</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
            <Link to="/register" className="btn-secondary">Get Started Free</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <h2>50+</h2>
          <p>Courses Available</p>
        </div>
        <div className="stat-card">
          <h2>1000+</h2>
          <p>Students Enrolled</p>
        </div>
        <div className="stat-card">
          <h2>20+</h2>
          <p>Expert Instructors</p>
        </div>
        <div className="stat-card">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Training Scheduler?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Structured Learning</h3>
            <p>Carefully designed curriculum with step by step lessons to ensure maximum understanding.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Verified Certificates</h3>
            <p>Earn certificates that can be verified by anyone using a unique certificate ID.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>AI Proctored Exams</h3>
            <p>Final exams are monitored by AI to ensure fair assessment for all students.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Learn Anywhere</h3>
            <p>Access your courses from any device at any time that suits your schedule.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
<section className="cta">
  <div className="cta-box">
    <h2>Ready to Start Learning?</h2>
    <p>Join thousands of students already learning on Training Scheduler</p>
    <Link to="/register" className="btn-primary">Join For Free</Link>
  </div>
</section>

    </div>
  );
}

export default Home;