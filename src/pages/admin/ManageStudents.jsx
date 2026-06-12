import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin/ManageStudents.css';

const ManageStudents = () => {

  const [students, setStudents] = useState([
    { id: 1, name: 'Hari Preyadharshan', email: 'hari@example.com', phone: '9876543210', courses: 3, progress: 75, certificates: 1, status: 'Active' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', courses: 2, progress: 50, certificates: 0, status: 'Active' },
    { id: 3, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '9876543212', courses: 4, progress: 100, certificates: 3, status: 'Active' },
    { id: 4, name: 'Anjali Singh', email: 'anjali@example.com', phone: '9876543213', courses: 1, progress: 30, certificates: 0, status: 'Blocked' },
    { id: 5, name: 'Vikram Nair', email: 'vikram@example.com', phone: '9876543214', courses: 2, progress: 60, certificates: 1, status: 'Active' },
  ]);

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Blocked' : 'Active' } : s
    ));
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
          <Link to="/admin/students" className="sidebar-link active">👨‍🎓 Manage Students</Link>
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

        {/* Students Table */}
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Phone</th>
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
                    <td>{student.phone}</td>
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
                          onClick={() => toggleStatus(student.id)}
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
                  <p><strong>Phone:</strong> {selectedStudent.phone}</p>
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