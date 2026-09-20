import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/admin/ManageBatches.css';

const ManageBatches = () => {
  const showToast = useToast();

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = () => {
    return apiFetch('/api/admin/batches').then(res => res.json()).then(setBatches);
  };

  useEffect(() => {
    Promise.all([
      fetchBatches(),
      apiFetch('/api/courses/all').then(res => res.json()).then(setCourses),
    ])
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Error fetching batches:', err);
        setLoading(false);
      });
  }, []);

  const [rosterBatch, setRosterBatch] = useState(null);
  const [roster, setRoster] = useState({ assigned: [], eligible: [] });
  const [rosterLoading, setRosterLoading] = useState(false);

  const fetchRoster = (batchId) => {
    setRosterLoading(true);
    apiFetch(`/api/admin/batches/${batchId}/roster`)
      .then(res => res.json())
      .then(data => setRoster(data))
      .catch(err => console.error('Error fetching roster:', err))
      .finally(() => setRosterLoading(false));
  };

  const openRoster = (batch) => {
    setRosterBatch(batch);
    fetchRoster(batch.id);
  };

  const handleAssignStudent = async (enrollmentId) => {
    try {
      const response = await apiFetch(`/api/admin/batches/${rosterBatch.id}/students/${enrollmentId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Request failed');
      }
      fetchRoster(rosterBatch.id);
      fetchBatches();
    } catch (error) {
      console.error('Error assigning student:', error);
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleRemoveStudent = async (enrollmentId) => {
    try {
      const response = await apiFetch(`/api/admin/batches/${rosterBatch.id}/students/${enrollmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Request failed');
      }
      fetchRoster(rosterBatch.id);
      fetchBatches();
    } catch (error) {
      console.error('Error removing student:', error);
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    courseId: '',
    startDate: '',
    endDate: ''
  });

  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editBatch, setEditBatch] = useState({
    name: '',
    courseId: '',
    startDate: '',
    endDate: ''
  });

  const handleEditClick = (batch) => {
    const matchingCourse = courses.find(c => c.title === batch.course);
    setEditBatch({
      name: batch.name,
      courseId: matchingCourse ? String(matchingCourse.id) : '',
      startDate: batch.startDate,
      endDate: batch.endDate,
    });
    setEditingBatchId(batch.id);
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`/api/admin/batches/${editingBatchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editBatch, courseId: Number(editBatch.courseId) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');

      setBatches(batches.map(b => (b.id === editingBatchId ? data : b)));
      setEditingBatchId(null);
      showToast('Batch updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating batch:', error);
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBatch, courseId: Number(newBatch.courseId) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');

      setBatches([...batches, data]);
      setShowAddBatch(false);
      setNewBatch({ name: '', courseId: '', startDate: '', endDate: '' });
      showToast('Batch created successfully!', 'success');
    } catch (error) {
      console.error('Error creating batch:', error);
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;
    try {
      const response = await apiFetch(`/api/admin/batches/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setBatches(batches.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting batch:', error);
      showToast('Failed to delete batch. Please try again.', 'error');
    }
  };

  return (
    <div className="admin-page">

      <AdminSidebar />

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
                    value={newBatch.courseId}
                    onChange={(e) => setNewBatch({ ...newBatch, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
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

        {/* Edit Batch Modal */}
        {editingBatchId !== null && (
          <div className="modal-overlay" onClick={() => setEditingBatchId(null)}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Batch</h2>
                <button className="modal-close" onClick={() => setEditingBatchId(null)}>✕</button>
              </div>
              <form onSubmit={handleUpdateBatch} className="quiz-form">
                <div className="form-group">
                  <label>Batch Name</label>
                  <input
                    type="text"
                    placeholder="Enter batch name"
                    value={editBatch.name}
                    onChange={(e) => setEditBatch({ ...editBatch, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select
                    value={editBatch.courseId}
                    onChange={(e) => setEditBatch({ ...editBatch, courseId: e.target.value })}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editBatch.startDate}
                    onChange={(e) => setEditBatch({ ...editBatch, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editBatch.endDate}
                    onChange={(e) => setEditBatch({ ...editBatch, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setEditingBatchId(null)}>Cancel</button>
                  <button type="submit" className="btn-create">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Students Modal */}
        {rosterBatch !== null && (
          <div className="modal-overlay" onClick={() => setRosterBatch(null)}>
            <div className="quiz-modal batch-roster-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Students — {rosterBatch.name}</h2>
                <button className="modal-close" onClick={() => setRosterBatch(null)}>✕</button>
              </div>

              {rosterLoading && <p>Loading students...</p>}

              {!rosterLoading && (
                <>
                  <div className="batch-roster-section">
                    <h4>Assigned ({roster.assigned.length})</h4>
                    {roster.assigned.length === 0 && <p className="batch-roster-empty">No students assigned yet.</p>}
                    {roster.assigned.map(enrollment => (
                      <div className="batch-roster-row" key={enrollment.id}>
                        <div>
                          <strong>{enrollment.user.fullName}</strong>
                          <span className="batch-roster-email">{enrollment.user.email}</span>
                        </div>
                        <button className="btn-delete" onClick={() => handleRemoveStudent(enrollment.id)}>Remove</button>
                      </div>
                    ))}
                  </div>

                  <div className="batch-roster-section">
                    <h4>Eligible ({roster.eligible.length})</h4>
                    <p className="batch-roster-empty">Students enrolled in {rosterBatch.course} but not yet in a batch.</p>
                    {roster.eligible.map(enrollment => (
                      <div className="batch-roster-row" key={enrollment.id}>
                        <div>
                          <strong>{enrollment.user.fullName}</strong>
                          <span className="batch-roster-email">{enrollment.user.email}</span>
                        </div>
                        <button className="btn-edit" onClick={() => handleAssignStudent(enrollment.id)}>Add</button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setRosterBatch(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {loading && <p style={{ padding: '2rem' }}>Loading batches...</p>}

        {!loading && (
          <>
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
                            <button className="btn-edit" onClick={() => openRoster(batch)}>👥 Students</button>
                            <button className="btn-edit" onClick={() => handleEditClick(batch)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(batch.id)}>🗑️ Delete</button>
                          </div>
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

export default ManageBatches;
