import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/admin/ManageStudents.css';

const ManageStudents = () => {
  const showToast = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }, []);

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Blocked' : 'Active';
    try {
      const response = await apiFetch(`/api/admin/students/${student.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Status update failed');
      const updated = await response.json();
      setStudents(students.map(s => (s.id === student.id ? updated : s)));
    } catch (error) {
      console.error('Error updating student status:', error);
      showToast('Failed to update student status. Please try again.', 'error');
    }
  };

  return (
    <div className="admin-page">

      <AdminSidebar />

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <h1>Manage Students</h1>
          <p>View and manage all registered students</p>
        </div>

        {/* Search */}
        <div className="students-toolbar">
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="students-search"
          />
          <span className="students-count">{filtered.length} students found</span>
        </div>

        {loading && <p style={{ padding: '2rem' }}>Loading students...</p>}

        {/* Students Table */}
        {!loading && (
          <div className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Courses</th>
                    <th>Progress</th>
                    <th>Certificates</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="student-info">
                          <span className="student-avatar">👤</span>
                          <div>
                            <p className="student-name">{student.name}</p>
                            <p className="student-email">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{student.courses}</td>
                      <td>
                        <div className="table-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </td>
                      <td>🏆 {student.certificates}</td>
                      <td>
                        <span className={`status-badge ${student.status.toLowerCase()}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            onClick={() => setSelectedStudent(student)}
                          >
                            👁️ View
                          </button>
                          <button
                            className={`btn-toggle ${student.status === 'Active' ? 'block' : 'unblock'}`}
                            onClick={() => toggleStatus(student)}
                          >
                            {student.status === 'Active' ? '🚫 Block' : '✅ Unblock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="student-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Details</h2>
                <button className="modal-close" onClick={() => setSelectedStudent(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="modal-avatar">👤</div>
                <h3>{selectedStudent.name}</h3>
                <p className="modal-email">{selectedStudent.email}</p>
                <div className="modal-stats">
                  <div className="modal-stat">
                    <h4>{selectedStudent.courses}</h4>
                    <p>Courses</p>
                  </div>
                  <div className="modal-stat">
                    <h4>{selectedStudent.progress}%</h4>
                    <p>Progress</p>
                  </div>
                  <div className="modal-stat">
                    <h4>{selectedStudent.certificates}</h4>
                    <p>Certificates</p>
                  </div>
                </div>
                <div className="modal-info">
                  <p><strong>Status:</strong> {selectedStudent.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageStudents;
