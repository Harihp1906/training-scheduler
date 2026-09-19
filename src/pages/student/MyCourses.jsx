import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import StudentSidebar from '../../components/student/StudentSidebar';
import '../styles/student/MyCourses.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [certificatesByCourse, setCertificatesByCourse] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);

    const parseOrThrow = (res) => {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    };

    Promise.all([
      apiFetch(`/api/enrollments/user/${storedUser.id}`).then(parseOrThrow),
      apiFetch(`/api/certificates/user/${storedUser.id}`).then(parseOrThrow),
    ])
      .then(([enrollmentData, certificateData]) => {
        setEnrollments(enrollmentData);
        const byCourse = {};
        certificateData.forEach(cert => {
          byCourse[cert.courseId] = cert;
        });
        setCertificatesByCourse(byCourse);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="dashboard-page"><p style={{padding:'2rem'}}>Loading...</p></div>;

  return (
    <div className="dashboard-page">

      <StudentSidebar user={user} />

      {/* Main Content */}
      <div className="dashboard-main">

        <div className="dashboard-welcome">
          <h1>My Courses</h1>
          <p>Track your enrolled courses and progress</p>
        </div>

        <div className="mycourses-grid">
          {enrollments.length === 0 ? (
            <p>You are not enrolled in any courses yet. <Link to="/courses">Browse courses</Link></p>
          ) : (
            enrollments.map(enrollment => {
              const certificate = certificatesByCourse[enrollment.course.id];
              return (
                <div className="mycourse-card" key={enrollment.id}>

                <div className="mycourse-top">
                  <span className="course-category">{enrollment.course.category}</span>
                  <span className={`mycourse-status ${enrollment.status === 'Completed' ? 'completed' : 'inprogress'}`}>
                    {enrollment.status}
                  </span>
                </div>

                <h3>{enrollment.course.title}</h3>

                <div className="mycourse-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                  <span>{enrollment.progress}%</span>
                </div>

                <p className="mycourse-lessons">{enrollment.course.totalLessons} total lessons</p>

                <div className="mycourse-actions">
                  <Link to={`/course/${enrollment.course.id}`} className="btn-continue">
                    {enrollment.status === 'Completed' ? 'Review' : 'Continue'}
                  </Link>
                  {certificate && (
                    <Link to={`/certificate/${certificate.certificateCode}`} className="btn-certificate">
                      🏆 Certificate
                    </Link>
                  )}
                </div>

              </div>
            );
          })
          )}
        </div>

      </div>
    </div>
  );
}

export default MyCourses;