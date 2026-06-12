import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin/ManageCourses.css';

const ManageCourses = () => {

  const [courses, setCourses] = useState([
    { id: 1, title: 'Java Programming', category: 'Programming', level: 'Beginner', lessons: 24, students: 245, status: 'Active' },
    { id: 2, title: 'Spring Boot', category: 'Programming', level: 'Intermediate', lessons: 18, students: 180, status: 'Active' },
    { id: 3, title: 'React JS', category: 'Web Development', level: 'Intermediate', lessons: 21, students: 320, status: 'Active' },
    { id: 4, title: 'HTML & CSS', category: 'Web Development', level: 'Beginner', lessons: 14, students: 410, status: 'Active' },
    { id: 5, title: 'PostgreSQL', category: 'Database', level: 'Beginner', lessons: 16, students: 190, status: 'Inactive' },
    { id: 6, title: 'Python Basics', category: 'Programming', level: 'Beginner', lessons: 20, students: 280, status: 'Active' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
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
          <Link to="/admin/courses" className="sidebar-link active">📚 Manage Courses</Link>
          <Link to="/admin/students" className="sidebar-link">👨‍🎓 Manage Students</Link>
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
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td className="course-title-cell">{course.title}</td>
                    <td>
                      <span className="category-badge">{course.category}</span>
                    </td>
                    <td>
                      <span className={`level-badge ${course.level.toLowerCase()}`}>
                        {course.level}
                      </span>
                    </td>
                    <td>{course.lessons}</td>
                    <td>{course.students}</td>
                    <td>
                      <span className={`status-badge ${course.status.toLowerCase()}`}>
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/courses/create`} className="btn-edit">✏️ Edit</Link>
                        <button className="btn-delete" onClick={() => handleDelete(course.id)}>🗑️ Delete</button>
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

export default ManageCourses;