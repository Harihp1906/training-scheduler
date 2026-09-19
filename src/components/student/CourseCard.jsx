import { Link } from 'react-router-dom';
import '../styles/student/CourseCard.css';

const CATEGORY_ICONS = {
  'Programming': '💻',
  'Web Development': '🌐',
  'Database': '🗄️',
  'Data Science': '📊',
};

const CourseCard = ({ course }) => (
  <div className="course-card">
    <div className="course-card-thumbnail">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.title} loading="lazy" />
      ) : (
        <div className="course-card-thumbnail-placeholder">
          <span>{CATEGORY_ICONS[course.category] || '📘'}</span>
        </div>
      )}
    </div>

    <div className="course-card-body">
      <div className="course-card-top">
        <span className="course-category">{course.category}</span>
        <span className={`course-level ${course.level.toLowerCase()}`}>{course.level}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-meta">
        <span>📅 {course.duration}</span>
        <span>📚 {course.totalLessons} lessons</span>
      </div>
      <Link to={`/course/${course.id}`} className="btn-enroll">
        View Course
      </Link>
    </div>
  </div>
);

export default CourseCard;
