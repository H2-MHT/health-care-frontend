import { useNavigate } from "react-router-dom";
import './unauthorized.css'
const Unauthorized = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_token')
    navigate("/login")
  }

  return (
    <div className="unauthouized_container">
      <h1 className="accessHeading">Access Denied</h1>
      <p className="permissionText">You do not have permission to view this page.</p>
      <button className="loginButton" onClick={goToLogin}>
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
