import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <span className="loading loading-spinner w-40 h-40 text-white"></span>
      </div>
    );
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={location.pathname} replace></Navigate>;
};

export default PrivateRoute;
