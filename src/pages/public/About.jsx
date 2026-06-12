import '../styles/public/About.css';

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Training Scheduler</h1>
        <p>Empowering professionals and students with quality training programs since 2024</p>
      </div>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>Training Scheduler is built with one goal in mind — to provide accessible, high quality professional training to everyone. We believe that education should be structured, verifiable and fair.</p>
          <p>Our platform combines modern learning techniques with AI powered proctoring to ensure every certificate earned is a true reflection of the student's knowledge and hard work.</p>
        </div>
        <div className="mission-image">
          <div className="mission-placeholder">🎓</div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Excellence</h3>
            <p>We maintain the highest standards in our course content and delivery.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔒</div>
            <h3>Integrity</h3>
            <p>AI proctored exams ensure every certificate represents genuine achievement.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Accessibility</h3>
            <p>Quality education should be available to everyone, everywhere.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🚀</div>
            <h3>Innovation</h3>
            <p>We continuously improve our platform with the latest technology.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="about-stat">
          <h2>50+</h2>
          <p>Courses Available</p>
        </div>
        <div className="about-stat">
          <h2>1000+</h2>
          <p>Students Enrolled</p>
        </div>
        <div className="about-stat">
          <h2>20+</h2>
          <p>Expert Instructors</p>
        </div>
        <div className="about-stat">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">👨‍💼</div>
            <h3>Hari Preyadharshan</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">👩‍🏫</div>
            <h3>Ms. Lavanya G</h3>
            <p>Academic Director</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">👨‍💻</div>
            <h3>Santhosh Udayanan</h3>
            <p>CEO & Mentor</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;