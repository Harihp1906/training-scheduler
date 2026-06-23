import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/public/Courses.css';

const Courses = () => {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real courses from backend when page loads
  useEffect(() => {
    fetch('http://localhost:8080/api/courses')
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

  const categories = ['All', 'Programming', 'Web Development', 'Database'];

  const filtered = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || course.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="courses-page">

      {/* Header */}
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Choose from our wide range of professional training programs</p>
      </div>

      {/* Search and Filter */}
      <div className="courses-toolbar">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="courses-search"
        />
        <div className="courses-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</p>}

      {/* Courses Grid */}
      {!loading && (
        <div className="courses-grid">
          {filtered.length > 0 ? (
            filtered.map(course => (
              <div className="course-card" key={course.id}>
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
            ))
          ) : (
            <div className="no-courses">
              <p>No courses found. Try a different search!</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Courses;