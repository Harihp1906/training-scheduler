import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/student/Dashboard.css';

const Dashboard = () => {
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

  const completed = enrollments.filter(e => e.status === 'Completed').length;
  const inProgress = enrollments.filter(e => e.status === 'In Progress').length;

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
          <Link to="/dashboard" className="sidebar-link active">🏠 Dashboard</Link>
          <Link to="/my-courses" className="sidebar-link">📚 My Courses</Link>
          <Link to="/courses" className="sidebar-link">🔍 Browse Courses</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
          <button onClick={handleLogout} className="sidebar-link logout">🚪 Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
          <p>Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dash-stat-card">
            <h2>{enrollments.length}</h2>
            <p>Enrolled Courses</p>
          </div>
          <div className="dash-stat-card">
            <h2>{completed}</h2>
            <p>Completed</p>
          </div>
          <div className="dash-stat-card">
            <h2>{inProgress}</h2>
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
            {enrollments.length === 0 ? (
              <p>You are not enrolled in any courses yet. <Link to="/courses">Browse courses</Link></p>
            ) : (
              enrollments.map(enrollment => (
                <div className="enrolled-card" key={enrollment.id}>
                  <div className="enrolled-info">
                    <h3>{enrollment.course.title}</h3>
                    <p>{enrollment.course.totalLessons} total lessons</p>
                  </div>
                  <div className="enrolled-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Link to={`/course/${enrollment.course.id}`} className="btn-continue">
                    Continue
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;