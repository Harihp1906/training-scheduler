import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/admin/CreateCourse.css';

const CreateCourse = () => {

  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    level: '',
    duration: '',
    description: '',
    thumbnail: ''
  });

  const [chapters, setChapters] = useState([
    { id: 1, title: '', lessons: [{ id: 1, title: '', duration: '', videoUrl: '' }] }
  ]);

  const handleCourseChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (chapterIndex, value) => {
    const updated = [...chapters];
    updated[chapterIndex].title = value;
    setChapters(updated);
  };

  const handleLessonChange = (chapterIndex, lessonIndex, field, value) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(updated);
  };

  const addChapter = () => {
    setChapters([...chapters, {
      id: chapters.length + 1,
      title: '',
      lessons: [{ id: 1, title: '', duration: '', videoUrl: '' }]
    }]);
  };

  const addLesson = (chapterIndex) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons.push({
      id: updated[chapterIndex].lessons.length + 1,
      title: '',
      duration: '',
      videoUrl: ''
    });
    setChapters(updated);
  };

  const removeChapter = (chapterIndex) => {
    setChapters(chapters.filter((_, i) => i !== chapterIndex));
  };

  const removeLesson = (chapterIndex, lessonIndex) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons = updated[chapterIndex].lessons.filter((_, i) => i !== lessonIndex);
    setChapters(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course Data:', courseData);
    console.log('Chapters:', chapters);
    alert('Course created successfully!');
    navigate('/admin/courses');
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
          <h1>Create New Course</h1>
          <p>Fill in the details to add a new course to the platform</p>
        </div>

        <form className="create-course-form" onSubmit={handleSubmit}>

          {/* Course Details */}
          <div className="form-section">
            <h2>Course Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  value={courseData.title}
                  onChange={handleCourseChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={courseData.category} onChange={handleCourseChange} required>
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database">Database</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Level</label>
                <select name="level" value={courseData.level} onChange={handleCourseChange} required>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 8 weeks"
                  value={courseData.duration}
                  onChange={handleCourseChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter course description"
                value={courseData.description}
                onChange={handleCourseChange}
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                placeholder="Enter thumbnail image URL"
                value={courseData.thumbnail}
                onChange={handleCourseChange}
              />
            </div>
          </div>

          {/* Chapters */}
          <div className="form-section">
            <div className="section-header">
              <h2>Course Chapters</h2>
              <button type="button" className="btn-add-chapter" onClick={addChapter}>
                ➕ Add Chapter
              </button>
            </div>

            {chapters.map((chapter, chapterIndex) => (
              <div className="chapter-form" key={chapter.id}>
                <div className="chapter-form-header">
                  <h3>Chapter {chapterIndex + 1}</h3>
                  {chapters.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeChapter(chapterIndex)}>
                      🗑️ Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Chapter Title</label>
                  <input
                    type="text"
                    placeholder="Enter chapter title"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(chapterIndex, e.target.value)}
                    required
                  />
                </div>

                {/* Lessons */}
                <div className="lessons-form">
                  <h4>Lessons</h4>
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div className="lesson-form" key={lesson.id}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Lesson Title</label>
                          <input
                            type="text"
                            placeholder="Enter lesson title"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'title', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 15 min"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'duration', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Video URL</label>
                        <input
                          type="text"
                          placeholder="Enter video URL"
                          value={lesson.videoUrl}
                          onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, 'videoUrl', e.target.value)}
                        />
                      </div>
                      {chapter.lessons.length > 1 && (
                        <button type="button" className="btn-remove-lesson" onClick={() => removeLesson(chapterIndex, lessonIndex)}>
                          Remove Lesson
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-add-lesson" onClick={() => addLesson(chapterIndex)}>
                    ➕ Add Lesson
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/courses')}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              ✅ Create Course
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateCourse;