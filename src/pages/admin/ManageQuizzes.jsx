import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../styles/admin/ManageQuizzes.css';

const emptyQuestion = () => ({ text: '', options: ['', ''], correctIndex: 0 });

const emptyForm = () => ({
  courseId: '',
  type: 'PRACTICE',
  chapter: '',
  timeLimitSeconds: 30,
  passScorePercent: 70,
  status: 'ACTIVE',
  questions: [emptyQuestion()],
});

const TYPE_LABELS = { PRACTICE: 'Practice Quiz', FINAL_EXAM: 'Final Exam' };

const ManageQuizzes = () => {

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/admin/quizzes').then(res => res.json()),
      apiFetch('/api/courses/all').then(res => res.json()),
    ])
      .then(([quizData, courseData]) => {
        setQuizzes(quizData);
        setCourses(courseData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching quizzes:', err);
        setLoading(false);
      });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setEditingId(quiz.id);
    setFormData({
      courseId: String(quiz.courseId),
      type: quiz.type,
      chapter: quiz.chapter,
      timeLimitSeconds: quiz.timeLimitSeconds,
      passScorePercent: quiz.passScorePercent,
      status: quiz.status,
      questions: quiz.questions.map(q => ({ text: q.text, options: [...q.options], correctIndex: q.correctIndex })),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const response = await apiFetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  // ---- question editing helpers ----

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...formData.questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    const options = [...updated[qIndex].options];
    options[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setFormData({ ...formData, questions: updated });
  };

  const setCorrectOption = (qIndex, oIndex) => {
    updateQuestion(qIndex, 'correctIndex', oIndex);
  };

  const addOption = (qIndex) => {
    const updated = [...formData.questions];
    updated[qIndex] = { ...updated[qIndex], options: [...updated[qIndex].options, ''] };
    setFormData({ ...formData, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...formData.questions];
    const question = updated[qIndex];
    if (question.options.length <= 2) return;
    const options = question.options.filter((_, i) => i !== oIndex);
    const correctIndex = question.correctIndex === oIndex ? 0 : (question.correctIndex > oIndex ? question.correctIndex - 1 : question.correctIndex);
    updated[qIndex] = { ...question, options, correctIndex };
    setFormData({ ...formData, questions: updated });
  };

  const addQuestion = () => {
    setFormData({ ...formData, questions: [...formData.questions, emptyQuestion()] });
  };

  const removeQuestion = (qIndex) => {
    if (formData.questions.length <= 1) return;
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== qIndex) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      courseId: Number(formData.courseId),
      type: formData.type,
      chapter: formData.chapter,
      timeLimitSeconds: Number(formData.timeLimitSeconds),
      passScorePercent: Number(formData.passScorePercent),
      status: formData.status,
      questions: formData.questions.map(q => ({
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    };

    try {
      const url = editingId ? `/api/admin/quizzes/${editingId}` : '/api/admin/quizzes';
      const method = editingId ? 'PUT' : 'POST';
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');

      if (editingId) {
        setQuizzes(quizzes.map(q => (q.id === editingId ? data : q)));
      } else {
        setQuizzes([...quizzes, data]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
              <h1>Manage Quizzes</h1>
              <p>Create and manage quizzes for each course chapter</p>
            </div>
            <button className="btn-add-course" onClick={openCreateModal}>
              ➕ Add New Quiz
            </button>
          </div>
        </div>

        {/* Add/Edit Quiz Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="quiz-modal quiz-modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Edit Quiz' : 'Add New Quiz'}</h2>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="quiz-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Course</label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="PRACTICE">Practice Quiz</option>
                      <option value="FINAL_EXAM">Final Exam</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Chapter / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Introduction to Java"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Time Limit (seconds per question)</label>
                    <input
                      type="number"
                      min="5"
                      value={formData.timeLimitSeconds}
                      onChange={(e) => setFormData({ ...formData, timeLimitSeconds: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Pass Score (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.passScorePercent}
                      onChange={(e) => setFormData({ ...formData, passScorePercent: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Questions */}
                <div className="questions-section">
                  <div className="questions-section-header">
                    <h3>Questions</h3>
                    <button type="button" className="btn-add-question" onClick={addQuestion}>
                      ➕ Add Question
                    </button>
                  </div>

                  {formData.questions.map((question, qIndex) => (
                    <div className="question-editor" key={qIndex}>
                      <div className="question-editor-header">
                        <h4>Question {qIndex + 1}</h4>
                        {formData.questions.length > 1 && (
                          <button type="button" className="btn-remove-question" onClick={() => removeQuestion(qIndex)}>
                            🗑️ Remove
                          </button>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Enter question text"
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                          required
                        />
                      </div>

                      <p className="options-hint">Select the correct answer:</p>
                      {question.options.map((option, oIndex) => (
                        <div className="option-row" key={oIndex}>
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctIndex === oIndex}
                            onChange={() => setCorrectOption(qIndex, oIndex)}
                          />
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            required
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              className="btn-remove-option"
                              onClick={() => removeOption(qIndex, oIndex)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="btn-add-option" onClick={() => addOption(qIndex)}>
                        ➕ Add Option
                      </button>
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-create" disabled={submitting}>
                    {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Quiz'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && <p style={{ padding: '2rem' }}>Loading quizzes...</p>}

        {/* Quizzes Table */}
        {!loading && (
          <div className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Chapter</th>
                    <th>Type</th>
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
                      <td className="course-title-cell">{quiz.courseTitle}</td>
                      <td>{quiz.chapter}</td>
                      <td>{TYPE_LABELS[quiz.type] || quiz.type}</td>
                      <td>{quiz.questions.length}</td>
                      <td>{quiz.timeLimitSeconds}s</td>
                      <td>{quiz.passScorePercent}%</td>
                      <td>{quiz.attempts}</td>
                      <td>
                        <span className={`status-badge ${quiz.status.toLowerCase()}`}>
                          {quiz.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => openEditModal(quiz)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(quiz.id)}>🗑️ Delete</button>
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

export default ManageQuizzes;
