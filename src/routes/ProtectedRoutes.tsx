import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "@/stores/user.stores";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useUserStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
