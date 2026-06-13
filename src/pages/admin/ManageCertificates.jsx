import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin/ManageCertificates.css';

const ManageCertificates = () => {

  const [certificates, setCertificates] = useState([
    { id: 'TS-2024-001', student: 'Hari Preyadharshan', email: 'hari@example.com', course: 'Java Programming', score: '92%', grade: 'Distinction', date: 'June 12, 2024', status: 'Valid' },
    { id: 'TS-2024-002', student: 'Rahul Kumar', email: 'rahul@example.com', course: 'React JS', score: '85%', grade: 'Merit', date: 'June 10, 2024', status: 'Valid' },
    { id: 'TS-2024-003', student: 'Priya Sharma', email: 'priya@example.com', course: 'Spring Boot', score: '78%', grade: 'Pass', date: 'June 8, 2024', status: 'Valid' },
    { id: 'TS-2024-004', student: 'Vikram Nair', email: 'vikram@example.com', course: 'PostgreSQL', score: '88%', grade: 'Merit', date: 'June 5, 2024', status: 'Revoked' },
  ]);

  const [search, setSearch] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const filtered = certificates.filter(c =>
    c.student.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = (id) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      setCertificates(certificates.map(c =>
        c.id === id ? { ...c, status: 'Revoked' } : c
      ));
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const found = certificates.find(c => c.id === verifyId);
    setVerifyResult(found || null);
  };

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
          <Link to="/admin/certificates" className="sidebar-link active">🏆 Certificates</Link>
          <Link to="/admin/batches" className="sidebar-link">👥 Batches</Link>
          <Link to="/admin/reports" className="sidebar-link">📈 Reports</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Manage Certificates</h1>
          <p>View, verify and manage all issued certificates</p>
        </div>

        {/* Verify Section */}
        <div className="verify-section">
          <h2>🔍 Verify Certificate</h2>
          <form className="verify-form" onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g. TS-2024-001)"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              required
            />
            <button type="submit" className="btn-verify">Verify</button>
          </form>

          {verifyResult !== null && (
            <div className={`verify-result ${verifyResult ? verifyResult.status.toLowerCase() : 'notfound'}`}>
              {verifyResult ? (
                <>
                  <span className="verify-icon">{verifyResult.status === 'Valid' ? '✅' : '❌'}</span>
                  <div>
                    <h4>{verifyResult.status === 'Valid' ? 'Certificate is Valid!' : 'Certificate has been Revoked!'}</h4>
                    <p><strong>{verifyResult.student}</strong> — {verifyResult.course} — {verifyResult.score}</p>
                    <p>Issued on: {verifyResult.date}</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="verify-icon">❌</span>
                  <div>
                    <h4>Certificate Not Found!</h4>
                    <p>No certificate found with ID: {verifyId}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="students-toolbar">
          <input
            type="text"
            placeholder="Search by student, course or certificate ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="students-search"
          />
          <span className="students-count">{filtered.length} certificates found</span>
        </div>

        {/* Certificates Table */}
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert.id}>
                    <td className="cert-id">{cert.id}</td>
                    <td>
                      <div className="student-info">
                        <span className="student-avatar">👤</span>
                        <div>
                          <p className="student-name">{cert.student}</p>
                          <p className="student-email">{cert.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{cert.course}</td>
                    <td><strong>{cert.score}</strong></td>
                    <td>
                      <span className={`grade-badge ${cert.grade.toLowerCase()}`}>
                        {cert.grade}
                      </span>
                    </td>
                    <td>{cert.date}</td>
                    <td>
                      <span className={`status-badge ${cert.status.toLowerCase()}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/certificate/${cert.id}`} className="btn-view">👁️ View</Link>
                        {cert.status === 'Valid' && (
                          <button className="btn-delete" onClick={() => handleRevoke(cert.id)}>
                            🚫 Revoke
                          </button>
                        )}
                      </div>
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

export default ManageCertificates;