import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector(state => state.user);

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
