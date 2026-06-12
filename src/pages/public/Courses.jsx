import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/public/Courses.css';

const Courses = () => {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const courses = [
    { id: 1, title: 'Java Programming', category: 'Programming', description: 'Master Java from basics to advanced OOP concepts.', duration: '8 weeks', lessons: 24, level: 'Beginner' },
    { id: 2, title: 'Spring Boot', category: 'Programming', description: 'Build powerful REST APIs using Java Spring Boot.', duration: '6 weeks', lessons: 18, level: 'Intermediate' },
    { id: 3, title: 'React JS', category: 'Web Development', description: 'Build modern web applications using React.', duration: '7 weeks', lessons: 21, level: 'Intermediate' },
    { id: 4, title: 'HTML & CSS', category: 'Web Development', description: 'Learn the fundamentals of web design and styling.', duration: '4 weeks', lessons: 14, level: 'Beginner' },
    { id: 5, title: 'PostgreSQL', category: 'Database', description: 'Master database design and SQL queries.', duration: '5 weeks', lessons: 16, level: 'Beginner' },
    { id: 6, title: 'Python Basics', category: 'Programming', description: 'Learn Python programming from scratch.', duration: '6 weeks', lessons: 20, level: 'Beginner' },
  ];

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

      {/* Courses Grid */}
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
                <span>📚 {course.lessons} lessons</span>
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

    </div>
  );
}

export default Courses;