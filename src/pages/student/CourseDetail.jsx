import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/student/CourseDetail.css';

const CourseDetail = () => {

  const { id } = useParams();
  const [activeChapter, setActiveChapter] = useState(0);

  const course = {
    id: id,
    title: 'Java Programming',
    category: 'Programming',
    level: 'Beginner',
    duration: '8 weeks',
    totalLessons: 24,
    description: 'Master Java from basics to advanced OOP concepts. This course covers everything you need to become a professional Java developer.',
    chapters: [
      {
        id: 1, title: 'Introduction to Java', completed: true,
        lessons: [
          { id: 1, title: 'What is Java?', duration: '10 min', completed: true },
          { id: 2, title: 'Installing Java JDK', duration: '15 min', completed: true },
          { id: 3, title: 'First Java Program', duration: '20 min', completed: true },
        ]
      },
      {
        id: 2, title: 'Java Basics', completed: true,
        lessons: [
          { id: 4, title: 'Variables and Data Types', duration: '25 min', completed: true },
          { id: 5, title: 'Operators', duration: '20 min', completed: true },
          { id: 6, title: 'Control Statements', duration: '30 min', completed: false },
        ]
      },
      {
        id: 3, title: 'Object Oriented Programming', completed: false,
        lessons: [
          { id: 7, title: 'Classes and Objects', duration: '30 min', completed: false },
          { id: 8, title: 'Inheritance', duration: '25 min', completed: false },
          { id: 9, title: 'Polymorphism', duration: '25 min', completed: false },
        ]
      },
    ]
  };

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
      </div>

      {/* Content */}
      <div className="coursedetail-content">

        {/* Chapters */}
        <div className="chapters-list">
          <h2>Course Content</h2>
          {course.chapters.map((chapter, index) => (
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
            <div className="side-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span>75%</span>
            </div>
            <p>18 of 24 lessons completed</p>
            <Link to={`/quiz/${id}`} className="btn-quiz">
              📝 Take Chapter Quiz
            </Link>
            <Link to={`/exam/instructions`} className="btn-exam">
              🎓 Start Final Exam
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;