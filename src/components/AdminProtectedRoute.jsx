import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;
