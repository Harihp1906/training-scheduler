import { Link } from 'react-router-dom';
import '../styles/student/Dashboard.css';

const Dashboard = () => {

  const enrolledCourses = [
    { id: 1, title: 'Java Programming', progress: 75, totalLessons: 24, completedLessons: 18 },
    { id: 2, title: 'Spring Boot', progress: 40, totalLessons: 18, completedLessons: 7 },
    { id: 3, title: 'React JS', progress: 20, totalLessons: 21, completedLessons: 4 },
  ];

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">👨‍🎓</div>
          <h3>Hari Preyadharshan</h3>
          <p>Student</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <h1>Welcome back, Hari! 👋</h1>
          <p>Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dash-stat-card">
            <h2>3</h2>
            <p>Enrolled Courses</p>
          </div>
          <div className="dash-stat-card">
            <h2>1</h2>
            <p>Completed</p>
          </div>
          <div className="dash-stat-card">
            <h2>2</h2>
            <p>In Progress</p>
          </div>
          <div className="dash-stat-card">
            <h2>0</h2>
            <p>Certificates</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="dashboard-section">
          <h2>My Courses</h2>
          <div className="enrolled-courses">
            {enrolledCourses.map(course => (
              <div className="enrolled-card" key={course.id}>
                <div className="enrolled-info">
                  <h3>{course.title}</h3>
                  <p>{course.completedLessons} of {course.totalLessons} lessons completed</p>
                </div>
                <div className="enrolled-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span>{course.progress}%</span>
                </div>
                <Link to={`/course/${course.id}`} className="btn-continue">
                  Continue
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;