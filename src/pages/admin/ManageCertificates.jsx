import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../styles/admin/ManageCertificates.css';

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const ManageCertificates = () => {

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        setCertificates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setLoading(false);
      });
  }, []);

  const [search, setSearch] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyNotFound, setVerifyNotFound] = useState(false);

  const filtered = certificates.filter(c =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateCode.toLowerCase().includes(search.toLowerCase()) ||
    c.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      const response = await apiFetch(`/api/certificates/${id}/revoke`, { method: 'PUT' });
      if (!response.ok) throw new Error('Revoke failed');
      const updated = await response.json();
      setCertificates(certificates.map(c => (c.id === id ? updated : c)));
    } catch (error) {
      console.error('Error revoking certificate:', error);
      alert('Failed to revoke certificate. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyResult(null);
    setVerifyNotFound(false);
    try {
      const response = await apiFetch(`/api/certificates/${verifyId}`);
      if (response.ok) {
        setVerifyResult(await response.json());
      } else {
        setVerifyNotFound(true);
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerifyNotFound(true);
    }
  };

  return (
    <div className="admin-page">

      <AdminSidebar />

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
              placeholder="Enter Certificate ID (e.g. TS-2026-001)"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              required
            />
            <button type="submit" className="btn-verify">Verify</button>
          </form>

          {(verifyResult || verifyNotFound) && (
            <div className={`verify-result ${verifyResult ? verifyResult.status.toLowerCase() : 'notfound'}`}>
              {verifyResult ? (
                <>
                  <span className="verify-icon">{verifyResult.status === 'VALID' ? '✅' : '❌'}</span>
                  <div>
                    <h4>{verifyResult.status === 'VALID' ? 'Certificate is Valid!' : 'Certificate has been Revoked!'}</h4>
                    <p><strong>{verifyResult.studentName}</strong> — {verifyResult.courseName} — {verifyResult.score}%</p>
                    <p>Issued on: {formatDate(verifyResult.issuedAt)}</p>
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
        {loading && <p style={{ padding: '2rem' }}>Loading certificates...</p>}

        {!loading && (
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
                      <td className="cert-id">{cert.certificateCode}</td>
                      <td>
                        <div className="student-info">
                          <span className="student-avatar">👤</span>
                          <div>
                            <p className="student-name">{cert.studentName}</p>
                            <p className="student-email">{cert.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td>{cert.courseName}</td>
                      <td><strong>{cert.score}%</strong></td>
                      <td>
                        <span className={`grade-badge ${cert.grade.toLowerCase()}`}>
                          {cert.grade}
                        </span>
                      </td>
                      <td>{formatDate(cert.issuedAt)}</td>
                      <td>
                        <span className={`status-badge ${cert.status.toLowerCase()}`}>
                          {cert.status === 'VALID' ? 'Valid' : 'Revoked'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/certificate/${cert.certificateCode}`} className="btn-view">👁️ View</Link>
                          {cert.status === 'VALID' && (
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
        )}

      </div>
    </div>
  );
}

export default ManageCertificates;
