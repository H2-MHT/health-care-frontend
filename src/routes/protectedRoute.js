import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const userType = JSON.parse(localStorage.getItem("user_data"))?.role // Get stored user type
  let token = localStorage.getItem('user_token')
  if (token && (!userType || !allowedRoles.includes(userType))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
