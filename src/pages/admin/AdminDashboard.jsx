import { Link } from 'react-router-dom';
import '../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {

  const stats = [
    { title: 'Total Students', value: '1,245', icon: '👨‍🎓' },
    { title: 'Total Courses', value: '24', icon: '📚' },
    { title: 'Certificates Issued', value: '856', icon: '🏆' },
    { title: 'Active Exams', value: '12', icon: '📝' },
  ];

  const recentStudents = [
    { id: 1, name: 'Hari Preyadharshan', email: 'hari@example.com', course: 'Java Programming', progress: 75, status: 'Active' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', course: 'React JS', progress: 50, status: 'Active' },
    { id: 3, name: 'Rahul Kumar', email: 'rahul@example.com', course: 'Spring Boot', progress: 100, status: 'Completed' },
    { id: 4, name: 'Anjali Singh', email: 'anjali@example.com', course: 'PostgreSQL', progress: 30, status: 'Active' },
    { id: 5, name: 'Vikram Nair', email: 'vikram@example.com', course: 'Python Basics', progress: 60, status: 'Active' },
  ];

  return (
    <div className="admin-page">

      {/* Admin Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">⚙️</div>
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="sidebar-link active">📊 Dashboard</Link>
          <Link to="/admin/courses" className="sidebar-link">📚 Manage Courses</Link>
          <Link to="/admin/students" className="sidebar-link">👨‍🎓 Manage Students</Link>
          <Link to="/admin/quizzes" className="sidebar-link">📝 Manage Quizzes</Link>
          <Link to="/admin/certificates" className="sidebar-link">🏆 Certificates</Link>
          <Link to="/admin/batches" className="sidebar-link">👥 Batches</Link>
          <Link to="/admin/reports" className="sidebar-link">📈 Reports</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {stats.map((stat, index) => (
            <div className="admin-stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h2>{stat.value}</h2>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/courses/create" className="action-card">
              <span>➕</span>
              <p>Add New Course</p>
            </Link>
            <Link to="/admin/students" className="action-card">
              <span>👨‍🎓</span>
              <p>View Students</p>
            </Link>
            <Link to="/admin/certificates" className="action-card">
              <span>🏆</span>
              <p>Certificates</p>
            </Link>
            <Link to="/admin/reports" className="action-card">
              <span>📈</span>
              <p>View Reports</p>
            </Link>
          </div>
        </div>

        {/* Recent Students */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Recent Students</h2>
            <Link to="/admin/students" className="view-all">View All →</Link>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-info">
                        <span className="student-avatar">👤</span>
                        <div>
                          <p className="student-name">{student.name}</p>
                          <p className="student-email">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{student.course}</td>
                    <td>
                      <div className="table-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span>{student.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/students`} className="btn-view">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;