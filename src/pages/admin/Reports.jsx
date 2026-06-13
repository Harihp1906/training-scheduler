import { Link } from 'react-router-dom';
import '../styles/admin/Reports.css';

const Reports = () => {

  const overallStats = [
    { title: 'Total Revenue', value: '₹4,25,000', icon: '💰', change: '+12%' },
    { title: 'Total Students', value: '1,245', icon: '👨‍🎓', change: '+8%' },
    { title: 'Courses Completed', value: '856', icon: '✅', change: '+15%' },
    { title: 'Certificates Issued', value: '856', icon: '🏆', change: '+15%' },
  ];

  const topCourses = [
    { rank: 1, title: 'Java Programming', students: 410, completion: 85, revenue: '₹1,20,000' },
    { rank: 2, title: 'React JS', students: 320, completion: 78, revenue: '₹96,000' },
    { rank: 3, title: 'Spring Boot', students: 280, completion: 72, revenue: '₹84,000' },
    { rank: 4, title: 'Python Basics', students: 245, completion: 68, revenue: '₹73,500' },
    { rank: 5, title: 'PostgreSQL', students: 190, completion: 65, revenue: '₹57,000' },
  ];

  const examStats = [
    { course: 'Java Programming', totalAttempts: 145, passed: 120, failed: 25, passRate: '82%' },
    { course: 'React JS', totalAttempts: 200, passed: 165, failed: 35, passRate: '82%' },
    { course: 'Spring Boot', totalAttempts: 98, passed: 75, failed: 23, passRate: '76%' },
    { course: 'PostgreSQL', totalAttempts: 75, passed: 55, failed: 20, passRate: '73%' },
  ];

  return (
    <div className="admin-page">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">⚙️</div>
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="sidebar-link">📊 Dashboard</Link>
          <Link to="/admin/courses" className="sidebar-link">📚 Manage Courses</Link>
          <Link to="/admin/students" className="sidebar-link">👨‍🎓 Manage Students</Link>
          <Link to="/admin/quizzes" className="sidebar-link">📝 Manage Quizzes</Link>
          <Link to="/admin/certificates" className="sidebar-link">🏆 Certificates</Link>
          <Link to="/admin/batches" className="sidebar-link">👥 Batches</Link>
          <Link to="/admin/reports" className="sidebar-link active">📈 Reports</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Reports & Analytics</h1>
          <p>Overview of platform performance and statistics</p>
        </div>

        {/* Overall Stats */}
        <div className="admin-stats">
          {overallStats.map((stat, index) => (
            <div className="admin-stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h2>{stat.value}</h2>
                <p>{stat.title}</p>
                <span className="stat-change">{stat.change} this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Courses */}
        <div className="admin-section" style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2>Top Performing Courses</h2>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Completion Rate</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map(course => (
                  <tr key={course.rank}>
                    <td>
                      <span className={`rank-badge rank-${course.rank}`}>
                        {course.rank === 1 ? '🥇' : course.rank === 2 ? '🥈' : course.rank === 3 ? '🥉' : `#${course.rank}`}
                      </span>
                    </td>
                    <td className="course-title-cell">{course.title}</td>
                    <td>{course.students}</td>
                    <td>
                      <div className="table-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${course.completion}%` }}></div>
                        </div>
                        <span>{course.completion}%</span>
                      </div>
                    </td>
                    <td><strong>{course.revenue}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exam Stats */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Exam Statistics</h2>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Total Attempts</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {examStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="course-title-cell">{stat.course}</td>
                    <td>{stat.totalAttempts}</td>
                    <td><span className="pass-count">✅ {stat.passed}</span></td>
                    <td><span className="fail-count">❌ {stat.failed}</span></td>
                    <td>
                      <span className="pass-rate">{stat.passRate}</span>
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

export default Reports;