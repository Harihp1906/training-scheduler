import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import '../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {

  const [statsData, setStatsData] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/admin/stats').then(res => res.json()),
      apiFetch('/api/admin/students/recent').then(res => res.json()),
    ])
      .then(([statsRes, recentRes]) => {
        setStatsData(statsRes);
        setRecentStudents(recentRes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading admin dashboard:', err);
        setLoading(false);
      });
  }, []);

  const stats = statsData ? [
    { title: 'Total Students', value: statsData.totalStudents, icon: '👨‍🎓' },
    { title: 'Total Courses', value: statsData.totalCourses, icon: '📚' },
    { title: 'Certificates Issued', value: statsData.certificatesIssued, icon: '🏆' },
    { title: 'Active Exams', value: statsData.activeExams, icon: '📝' },
  ] : [];

  return (
    <div className="admin-page">

      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>

        {loading && <p style={{ padding: '2rem' }}>Loading dashboard...</p>}

        {/* Stats */}
        {!loading && <div className="admin-stats">
          {stats.map((stat, index) => (
            <StatsCard key={index} icon={stat.icon} value={stat.value} label={stat.title} />
          ))}
        </div>}

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
        {!loading && <div className="admin-section">
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
        </div>}

      </div>
    </div>
  );
}

export default AdminDashboard;
