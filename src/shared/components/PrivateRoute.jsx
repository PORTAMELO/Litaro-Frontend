import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutSkeleton } from "./Ui/Skeletons";
import { PATHS } from "@/shared/utils/Paths";

function PrivateRoute({ children, allowedRoles, requireRole = true, fallback = <LayoutSkeleton /> }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return fallback;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} replace />;
  }

  if (requireRole && !user.role) {
    return <Navigate to={PATHS.selectProfile} replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.unauthorized} replace />;
  }

  return children;
}

export default PrivateRoute;
