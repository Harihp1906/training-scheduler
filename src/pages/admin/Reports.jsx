import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import '../styles/admin/Reports.css';

const Reports = () => {

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/reports')
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  }, []);

  // No pricing data exists on Course and there's no Payment entity, so
  // revenue can't be computed honestly -- only real, derivable stats here.
  const overallStats = report ? [
    { title: 'Total Students', value: report.totalStudents, icon: '👨‍🎓' },
    { title: 'Courses Completed', value: report.coursesCompleted, icon: '✅' },
    { title: 'Certificates Issued', value: report.certificatesIssued, icon: '🏆' },
  ] : [];

  return (
    <div className="admin-page">

      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Reports & Analytics</h1>
          <p>Overview of platform performance and statistics</p>
        </div>

        {loading && <p style={{ padding: '2rem' }}>Loading reports...</p>}

        {!loading && report && (
          <>
            {/* Overall Stats */}
            <div className="admin-stats">
              {overallStats.map((stat, index) => (
                <StatsCard key={index} icon={stat.icon} value={stat.value} label={stat.title} />
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
                    </tr>
                  </thead>
                  <tbody>
                    {report.topCourses.map((course, index) => {
                      const rank = index + 1;
                      return (
                        <tr key={course.title}>
                          <td>
                            <span className={`rank-badge rank-${rank}`}>
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                            </span>
                          </td>
                          <td className="course-title-cell">{course.title}</td>
                          <td>{course.students}</td>
                          <td>
                            <div className="table-progress">
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${course.completionRate}%` }}></div>
                              </div>
                              <span>{course.completionRate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                    {report.examStats.map((stat) => (
                      <tr key={stat.course}>
                        <td className="course-title-cell">{stat.course}</td>
                        <td>{stat.totalAttempts}</td>
                        <td><span className="pass-count">✅ {stat.passed}</span></td>
                        <td><span className="fail-count">❌ {stat.failed}</span></td>
                        <td>
                          <span className="pass-rate">{stat.passRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Reports;
