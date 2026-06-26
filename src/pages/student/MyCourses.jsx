import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/student/MyCourses.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);

    fetch(`http://localhost:8080/api/enrollments/user/${storedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="dashboard-page"><p style={{padding:'2rem'}}>Loading...</p></div>;

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">👨‍🎓</div>
          <h3>{user?.fullName}</h3>
          <p>Student</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link active">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
          <button onClick={handleLogout} className="sidebar-link logout">🚪 Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        <div className="dashboard-welcome">
          <h1>My Courses</h1>
          <p>Track your enrolled courses and progress</p>
        </div>

        <div className="mycourses-grid">
          {enrollments.length === 0 ? (
            <p>You are not enrolled in any courses yet. <Link to="/courses">Browse courses</Link></p>
          ) : (
            enrollments.map(enrollment => (
              <div className="mycourse-card" key={enrollment.id}>

                <div className="mycourse-top">
                  <span className="course-category">{enrollment.course.category}</span>
                  <span className={`mycourse-status ${enrollment.status === 'Completed' ? 'completed' : 'inprogress'}`}>
                    {enrollment.status}
                  </span>
                </div>

                <h3>{enrollment.course.title}</h3>

                <div className="mycourse-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <span>{enrollment.progress}%</span>
                </div>

                <p className="mycourse-lessons">{enrollment.course.totalLessons} total lessons</p>

                <div className="mycourse-actions">
                  <Link to={`/course/${enrollment.course.id}`} className="btn-continue">
                    {enrollment.status === 'Completed' ? 'Review' : 'Continue'}
                  </Link>
                  {enrollment.status === 'Completed' && (
                    <Link to={`/certificate/${enrollment.course.id}`} className="btn-certificate">
                      🏆 Certificate
                    </Link>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default MyCourses;