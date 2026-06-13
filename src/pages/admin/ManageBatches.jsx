import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin/ManageBatches.css';

const ManageBatches = () => {

  const [batches, setBatches] = useState([
    { id: 1, name: 'Batch A - Java 2024', course: 'Java Programming', students: 25, startDate: 'June 1, 2024', endDate: 'July 31, 2024', status: 'Active' },
    { id: 2, name: 'Batch B - React 2024', course: 'React JS', students: 30, startDate: 'June 5, 2024', endDate: 'Aug 5, 2024', status: 'Active' },
    { id: 3, name: 'Batch C - Spring 2024', course: 'Spring Boot', students: 20, startDate: 'May 1, 2024', endDate: 'June 30, 2024', status: 'Completed' },
    { id: 4, name: 'Batch D - SQL 2024', course: 'PostgreSQL', students: 15, startDate: 'July 1, 2024', endDate: 'Aug 15, 2024', status: 'Upcoming' },
  ]);

  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    course: '',
    startDate: '',
    endDate: ''
  });

  const handleAddBatch = (e) => {
    e.preventDefault();
    setBatches([...batches, {
      id: batches.length + 1,
      ...newBatch,
      students: 0,
      status: 'Upcoming'
    }]);
    setShowAddBatch(false);
    setNewBatch({ name: '', course: '', startDate: '', endDate: '' });
    alert('Batch created successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatches(batches.filter(b => b.id !== id));
    }
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
          <Link to="/admin/certificates" className="sidebar-link">🏆 Certificates</Link>
          <Link to="/admin/batches" className="sidebar-link active">👥 Batches</Link>
          <Link to="/admin/reports" className="sidebar-link">📈 Reports</Link>
          <Link to="/login" className="sidebar-link logout">🚪 Logout</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        <div className="admin-welcome">
          <div className="section-header">
            <div>
              <h1>Manage Batches</h1>
              <p>Create and manage training batches</p>
            </div>
            <button className="btn-add-course" onClick={() => setShowAddBatch(true)}>
              ➕ Create Batch
            </button>
          </div>
        </div>

        {/* Add Batch Modal */}
        {showAddBatch && (
          <div className="modal-overlay" onClick={() => setShowAddBatch(false)}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Batch</h2>
                <button className="modal-close" onClick={() => setShowAddBatch(false)}>✕</button>
              </div>
              <form onSubmit={handleAddBatch} className="quiz-form">
                <div className="form-group">
                  <label>Batch Name</label>
                  <input
                    type="text"
                    placeholder="Enter batch name"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    value={newBatch.course}
                    onChange={(e) => setNewBatch({ ...newBatch, course: e.target.value })}
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="Java Programming">Java Programming</option>
                    <option value="Spring Boot">Spring Boot</option>
                    <option value="React JS">React JS</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="Python Basics">Python Basics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newBatch.endDate}
                    onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddBatch(false)}>Cancel</button>
                  <button type="submit" className="btn-create">Create Batch</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="batch-stats">
          <div className="batch-stat-card">
            <h2>{batches.length}</h2>
            <p>Total Batches</p>
          </div>
          <div className="batch-stat-card">
            <h2>{batches.filter(b => b.status === 'Active').length}</h2>
            <p>Active Batches</p>
          </div>
          <div className="batch-stat-card">
            <h2>{batches.filter(b => b.status === 'Completed').length}</h2>
            <p>Completed</p>
          </div>
          <div className="batch-stat-card">
            <h2>{batches.reduce((acc, b) => acc + b.students, 0)}</h2>
            <p>Total Students</p>
          </div>
        </div>

        {/* Batches Table */}
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch Name</th>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => (
                  <tr key={batch.id}>
                    <td>{index + 1}</td>
                    <td className="course-title-cell">{batch.name}</td>
                    <td>{batch.course}</td>
                    <td>👥 {batch.students}</td>
                    <td>{batch.startDate}</td>
                    <td>{batch.endDate}</td>
                    <td>
                      <span className={`status-badge ${batch.status.toLowerCase()}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(batch.id)}>🗑️ Delete</button>
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

export default ManageBatches;