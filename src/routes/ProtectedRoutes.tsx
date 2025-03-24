// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "@/stores/user.stores"; // Adjust the path as needed
import { ROUTES } from "./route";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useUserStore();
  const location = useLocation();

  if (!token) {
    // Redirect to login page if user is not authenticated
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
