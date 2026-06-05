import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector(state => state.user);

 
  if (userData === undefined) {
    return null; 
  }

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
