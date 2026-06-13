import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin/ManageQuizzes.css';

const ManageQuizzes = () => {

  const [quizzes, setQuizzes] = useState([
    { id: 1, course: 'Java Programming', chapter: 'Introduction to Java', questions: 5, timeLimit: 30, passScore: 70, attempts: 145, status: 'Active' },
    { id: 2, course: 'Java Programming', chapter: 'Java Basics', questions: 8, timeLimit: 30, passScore: 70, attempts: 120, status: 'Active' },
    { id: 3, course: 'Spring Boot', chapter: 'Introduction to Spring', questions: 6, timeLimit: 30, passScore: 70, attempts: 98, status: 'Active' },
    { id: 4, course: 'React JS', chapter: 'React Basics', questions: 7, timeLimit: 30, passScore: 70, attempts: 200, status: 'Active' },
    { id: 5, course: 'PostgreSQL', chapter: 'SQL Basics', questions: 10, timeLimit: 30, passScore: 70, attempts: 75, status: 'Inactive' },
  ]);

  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    course: '',
    chapter: '',
    questions: '',
    timeLimit: 30,
    passScore: 70
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    setQuizzes([...quizzes, {
      id: quizzes.length + 1,
      ...newQuiz,
      attempts: 0,
      status: 'Active'
    }]);
    setShowAddQuiz(false);
    setNewQuiz({ course: '', chapter: '', questions: '', timeLimit: 30, passScore: 70 });
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
          <Link to="/admin/quizzes" className="sidebar-link active">📝 Manage Quizzes</Link>
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
              <h1>Manage Quizzes</h1>
              <p>Create and manage quizzes for each course chapter</p>
            </div>
            <button className="btn-add-course" onClick={() => setShowAddQuiz(true)}>
              ➕ Add New Quiz
            </button>
          </div>
        </div>

        {/* Add Quiz Modal */}
        {showAddQuiz && (
          <div className="modal-overlay" onClick={() => setShowAddQuiz(false)}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Quiz</h2>
                <button className="modal-close" onClick={() => setShowAddQuiz(false)}>✕</button>
              </div>
              <form onSubmit={handleAddQuiz} className="quiz-form">
                <div className="form-group">
                  <label>Course</label>
                  <select value={newQuiz.course} onChange={(e) => setNewQuiz({ ...newQuiz, course: e.target.value })} required>
                    <option value="">Select Course</option>
                    <option value="Java Programming">Java Programming</option>
                    <option value="Spring Boot">Spring Boot</option>
                    <option value="React JS">React JS</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Chapter</label>
                  <input type="text" placeholder="Enter chapter name" value={newQuiz.chapter} onChange={(e) => setNewQuiz({ ...newQuiz, chapter: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Number of Questions</label>
                  <input type="number" placeholder="Enter number of questions" value={newQuiz.questions} onChange={(e) => setNewQuiz({ ...newQuiz, questions: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time Limit (seconds per question)</label>
                  <input type="number" value={newQuiz.timeLimit} onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Pass Score (%)</label>
                  <input type="number" value={newQuiz.passScore} onChange={(e) => setNewQuiz({ ...newQuiz, passScore: e.target.value })} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddQuiz(false)}>Cancel</button>
                  <button type="submit" className="btn-create">Create Quiz</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quizzes Table */}
        <div className="admin-section">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Chapter</th>
                  <th>Questions</th>
                  <th>Time Limit</th>
                  <th>Pass Score</th>
                  <th>Attempts</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz.id}>
                    <td>{index + 1}</td>
                    <td className="course-title-cell">{quiz.course}</td>
                    <td>{quiz.chapter}</td>
                    <td>{quiz.questions}</td>
                    <td>{quiz.timeLimit}s</td>
                    <td>{quiz.passScore}%</td>
                    <td>{quiz.attempts}</td>
                    <td>
                      <span className={`status-badge ${quiz.status.toLowerCase()}`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(quiz.id)}>🗑️ Delete</button>
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

export default ManageQuizzes;