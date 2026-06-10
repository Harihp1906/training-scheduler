import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import CourseDetail from './pages/student/CourseDetail';
import Quiz from './pages/student/Quiz';
import Exam from './pages/student/Exam';
import ExamInstructions from './pages/student/ExamInstructions';
import ExamTerminated from './pages/student/ExamTerminated';
import Certificate from './pages/student/Certificate';
import Profile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import CreateCourse from './pages/admin/CreateCourse';
import ManageStudents from './pages/admin/ManageStudents';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageBatches from './pages/admin/ManageBatches';
import Reports from './pages/admin/Reports';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/exam/instructions" element={<ExamInstructions />} />
        <Route path="/exam/:id" element={<Exam />} />
        <Route path="/exam/terminated" element={<ExamTerminated />} />
        <Route path="/certificate/:id" element={<Certificate />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<ManageCourses />} />
        <Route path="/admin/courses/create" element={<CreateCourse />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/quizzes" element={<ManageQuizzes />} />
        <Route path="/admin/certificates" element={<ManageCertificates />} />
        <Route path="/admin/batches" element={<ManageBatches />} />
        <Route path="/admin/reports" element={<Reports />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;