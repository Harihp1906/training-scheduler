import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../components/common/Toast.jsx';
import '../styles/admin/ManageCourses.css';

const ManageCourses = () => {
  const showToast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/courses/all')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      showToast('Failed to delete course. Please try again.', 'error');
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
              <h1>Manage Courses</h1>
              <p>Add, edit or delete courses from the platform</p>
            </div>
            <Link to="/admin/courses/create" className="btn-add-course">
              ➕ Add New Course
            </Link>
          </div>
        </div>

        {/* Courses Table */}
        {loading && <p style={{ padding: '2rem' }}>Loading courses...</p>}

        {!loading && (
          <div className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th></th>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Duration</th>
                    <th>Lessons</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr key={course.id}>
                      <td>{index + 1}</td>
                      <td>
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt="" className="course-row-thumbnail" />
                        ) : (
                          <div className="course-row-thumbnail-placeholder">📘</div>
                        )}
                      </td>
                      <td className="course-title-cell">{course.title}</td>
                      <td>
                        <span className="category-badge">{course.category}</span>
                      </td>
                      <td>
                        <span className={`level-badge ${course.level.toLowerCase()}`}>
                          {course.level}
                        </span>
                      </td>
                      <td>{course.duration}</td>
                      <td>{course.totalLessons}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/admin/courses/edit/${course.id}`} className="btn-edit">✏️ Edit</Link>
                          <button className="btn-delete" onClick={() => handleDelete(course.id)}>🗑️ Delete</button>
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

export default ManageCourses;