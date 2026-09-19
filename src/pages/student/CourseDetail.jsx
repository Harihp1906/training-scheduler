import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import '../styles/student/CourseDetail.css';

// Placeholder chapter/lesson structure — backend has no curriculum model yet,
// so this stays static until a Chapter/Lesson entity exists.
const placeholderChapters = [
  {
    id: 1, title: 'Introduction', completed: true,
    lessons: [
      { id: 1, title: 'Getting Started', duration: '10 min', completed: true },
      { id: 2, title: 'Setup & Tools', duration: '15 min', completed: true },
      { id: 3, title: 'First Steps', duration: '20 min', completed: true },
    ]
  },
  {
    id: 2, title: 'Core Concepts', completed: false,
    lessons: [
      { id: 4, title: 'Fundamentals', duration: '25 min', completed: true },
      { id: 5, title: 'Practice', duration: '20 min', completed: false },
      { id: 6, title: 'Deep Dive', duration: '30 min', completed: false },
    ]
  },
];

const CourseDetail = () => {

  const { id } = useParams();
  const [activeChapter, setActiveChapter] = useState(0);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [enrollment, setEnrollment] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    apiFetch(`/api/courses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching course:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user) {
      setEnrollmentLoading(false);
      return;
    }
    apiFetch(`/api/enrollments/user/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch enrollments');
        return res.json();
      })
      .then(data => {
        const match = data.find(e => String(e.course.id) === String(id));
        setEnrollment(match || null);
        setEnrollmentLoading(false);
      })
      .catch(err => {
        console.error('Error fetching enrollment:', err);
        setEnrollmentLoading(false);
      });
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const response = await apiFetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: Number(id) }),
      });
      const data = await response.json();
      if (response.ok) {
        setEnrollment(data);
      } else {
        alert(data.message || 'Could not enroll in this course');
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="coursedetail-page"><p style={{ padding: '2rem' }}>Loading course...</p></div>;
  if (error || !course) return <div className="coursedetail-page"><p style={{ padding: '2rem' }}>Course not found.</p></div>;

  return (
    <div className="coursedetail-page">

      {/* Header */}
      <div className="coursedetail-header">
        <div className="coursedetail-info">
          <span className="course-category">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="coursedetail-meta">
            <span>📅 {course.duration}</span>
            <span>📚 {course.totalLessons} lessons</span>
            <span>🎯 {course.level}</span>
          </div>
        </div>
        {course.thumbnailUrl && (
          <img src={course.thumbnailUrl} alt={course.title} className="coursedetail-thumbnail" />
        )}
      </div>

      {/* Content */}
      <div className="coursedetail-content">

        {/* Chapters */}
        <div className="chapters-list">
          <h2>Course Content</h2>
          {placeholderChapters.map((chapter, index) => (
            <div className="chapter-item" key={chapter.id}>
              <div
                className={`chapter-header ${activeChapter === index ? 'active' : ''}`}
                onClick={() => setActiveChapter(activeChapter === index ? -1 : index)}
              >
                <div className="chapter-title">
                  <span className={`chapter-status ${chapter.completed ? 'done' : ''}`}>
                    {chapter.completed ? '✅' : '⭕'}
                  </span>
                  <h3>{chapter.title}</h3>
                </div>
                <span>{activeChapter === index ? '▲' : '▼'}</span>
              </div>

              {activeChapter === index && (
                <div className="lessons-list">
                  {chapter.lessons.map(lesson => (
                    <div className="lesson-item" key={lesson.id}>
                      <span className={`lesson-status ${lesson.completed ? 'done' : ''}`}>
                        {lesson.completed ? '✅' : '▶️'}
                      </span>
                      <span className="lesson-title">{lesson.title}</span>
                      <span className="lesson-duration">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side Panel */}
        <div className="coursedetail-side">
          <div className="side-card">
            <h3>Your Progress</h3>

            {enrollmentLoading ? (
              <p>Loading...</p>
            ) : !user ? (
              <>
                <p>Log in to enroll and track your progress in this course.</p>
                <Link to="/login" className="btn-quiz">🔐 Login to Enroll</Link>
              </>
            ) : !enrollment ? (
              <>
                <p>You're not enrolled in this course yet.</p>
                <button className="btn-quiz" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : '➕ Enroll Now'}
                </button>
              </>
            ) : (
              <>
                <div className="side-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <span>{enrollment.progress}%</span>
                </div>
                <p>{enrollment.status}</p>
                <Link to={`/quiz/${id}`} className="btn-quiz">
                  📝 Take Chapter Quiz
                </Link>
                <Link to={`/exam/instructions/${id}`} className="btn-exam">
                  🎓 Start Final Exam
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;