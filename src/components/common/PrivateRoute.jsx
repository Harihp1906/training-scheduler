import { Navigate } from 'react-router-dom';

// adminOnly routes also require user.role === 'admin' (case-insensitive,
// since we don't control how the backend cases the role string).
const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
