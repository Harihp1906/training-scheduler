import { Link } from 'react-router-dom';
import '../styles/student/MyCourses.css';

const MyCourses = () => {

  const courses = [
    { id: 1, title: 'Java Programming', category: 'Programming', progress: 75, totalLessons: 24, completedLessons: 18, status: 'In Progress' },
    { id: 2, title: 'Spring Boot', category: 'Programming', progress: 40, totalLessons: 18, completedLessons: 7, status: 'In Progress' },
    { id: 3, title: 'React JS', category: 'Web Development', progress: 100, totalLessons: 21, completedLessons: 21, status: 'Completed' },
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
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link active">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        <div className="dashboard-welcome">
          <h1>My Courses</h1>
          <p>Track your enrolled courses and progress</p>
        </div>

        <div className="mycourses-grid">
          {courses.map(course => (
            <div className="mycourse-card" key={course.id}>

              <div className="mycourse-top">
                <span className="course-category">{course.category}</span>
                <span className={`mycourse-status ${course.status === 'Completed' ? 'completed' : 'inprogress'}`}>
                  {course.status}
                </span>
              </div>

              <h3>{course.title}</h3>

              <div className="mycourse-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                </div>
                <span>{course.progress}%</span>
              </div>

              <p className="mycourse-lessons">{course.completedLessons} of {course.totalLessons} lessons completed</p>

              <div className="mycourse-actions">
                <Link to={`/course/${course.id}`} className="btn-continue">
                  {course.status === 'Completed' ? 'Review' : 'Continue'}
                </Link>
                {course.status === 'Completed' && (
                  <Link to={`/certificate/${course.id}`} className="btn-certificate">
                    🏆 Certificate
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MyCourses;