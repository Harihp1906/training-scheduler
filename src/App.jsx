import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';

// Public Pages
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Courses from './pages/public/Courses.jsx';
import Contact from './pages/public/Contact.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';

// Student Pages
import Dashboard from './pages/student/Dashboard.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import CourseDetail from './pages/student/CourseDetail.jsx';
import Quiz from './pages/student/Quiz.jsx';
import Exam from './pages/student/Exam.jsx';
import ExamInstructions from './pages/student/ExamInstructions.jsx';
import ExamTerminated from './pages/student/ExamTerminated.jsx';
import Certificate from './pages/student/Certificate.jsx';
import Profile from './pages/student/Profile.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageCourses from './pages/admin/ManageCourses.jsx';
import CreateCourse from './pages/admin/CreateCourse.jsx';
import ManageStudents from './pages/admin/ManageStudents.jsx';
import ManageQuizzes from './pages/admin/ManageQuizzes.jsx';
import ManageCertificates from './pages/admin/ManageCertificates.jsx';
import ManageBatches from './pages/admin/ManageBatches.jsx';
import Reports from './pages/admin/Reports.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/exam/instructions" element={<ExamInstructions />} />
        <Route path="/exam/:id" element={<Exam />} />
        <Route path="/exam/terminated" element={<ExamTerminated />} />
        <Route path="/certificate/:id" element={<Certificate />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/courses" element={<PrivateRoute adminOnly><ManageCourses /></PrivateRoute>} />
        <Route path="/admin/courses/create" element={<PrivateRoute adminOnly><CreateCourse /></PrivateRoute>} />
        <Route path="/admin/students" element={<PrivateRoute adminOnly><ManageStudents /></PrivateRoute>} />
        <Route path="/admin/quizzes" element={<PrivateRoute adminOnly><ManageQuizzes /></PrivateRoute>} />
        <Route path="/admin/certificates" element={<PrivateRoute adminOnly><ManageCertificates /></PrivateRoute>} />
        <Route path="/admin/batches" element={<PrivateRoute adminOnly><ManageBatches /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute adminOnly><Reports /></PrivateRoute>} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;